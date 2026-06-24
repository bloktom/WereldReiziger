import { useCallback, useEffect, useState } from 'react'
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../firebase'
import { computeBattleScore, determineWinner } from '../utils/scoring'
import { visitedKey } from '../utils/countryStatus'
import { PLAYERS, STORAGE_KEYS } from '../utils/constants'
import { SEED_BATTLES, SEED_VISITED } from '../data/mockData'

function loadLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* opslag vol of niet beschikbaar — negeren */
  }
}

/**
 * Centrale data-hook. Praat met Firestore als die geconfigureerd is, anders
 * met lokale mock data (localStorage). De rest van de app merkt het verschil
 * niet: dezelfde functies, dezelfde datavorm.
 */
export function useTravelData() {
  const mode = isFirebaseConfigured && db ? 'firebase' : 'mock'
  const [visited, setVisitedState] = useState({})
  const [battles, setBattlesState] = useState({})
  const [profiles, setProfilesState] = useState({}) // { Floor: {avatarId}, Tom: {avatarId} }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ---- MOCK / DEMO-modus ----
  useEffect(() => {
    if (mode !== 'mock') return
    const seeded = localStorage.getItem(STORAGE_KEYS.seeded)
    if (!seeded) {
      saveLocal(STORAGE_KEYS.visited, SEED_VISITED)
      saveLocal(STORAGE_KEYS.battles, SEED_BATTLES)
      localStorage.setItem(STORAGE_KEYS.seeded, '1')
      setVisitedState(SEED_VISITED)
      setBattlesState(SEED_BATTLES)
    } else {
      setVisitedState(loadLocal(STORAGE_KEYS.visited, {}))
      setBattlesState(loadLocal(STORAGE_KEYS.battles, {}))
    }
    // Profielen laden (met eenmalige migratie van oude per-speler keys).
    let profs = loadLocal(STORAGE_KEYS.profiles, null)
    if (!profs) {
      profs = {}
      ;[PLAYERS.FLOOR, PLAYERS.TOM].forEach((p) => {
        const old = localStorage.getItem(`${STORAGE_KEYS.avatar}.${p}`)
        if (old) profs[p] = { player: p, avatarId: old }
      })
      saveLocal(STORAGE_KEYS.profiles, profs)
    }
    setProfilesState(profs)
    setLoading(false)
  }, [mode])

  // ---- FIREBASE-modus (realtime via onSnapshot) ----
  useEffect(() => {
    if (mode !== 'firebase') return
    setLoading(true)
    const unsubVisited = onSnapshot(
      collection(db, 'visitedCountries'),
      (snap) => {
        const obj = {}
        snap.forEach((d) => {
          obj[d.id] = d.data()
        })
        setVisitedState(obj)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )
    const unsubBattles = onSnapshot(
      collection(db, 'countryBattles'),
      (snap) => {
        const obj = {}
        snap.forEach((d) => {
          obj[d.id] = d.data()
        })
        setBattlesState(obj)
      },
      (err) => setError(err.message),
    )
    const unsubProfiles = onSnapshot(
      collection(db, 'profiles'),
      (snap) => {
        const obj = {}
        snap.forEach((d) => {
          obj[d.id] = d.data()
        })
        setProfilesState(obj)
      },
      (err) => setError(err.message),
    )
    return () => {
      unsubVisited()
      unsubBattles()
      unsubProfiles()
    }
  }, [mode])

  const persistVisited = useCallback(
    (next) => {
      setVisitedState(next)
      if (mode === 'mock') saveLocal(STORAGE_KEYS.visited, next)
    },
    [mode],
  )

  const persistBattles = useCallback(
    (next) => {
      setBattlesState(next)
      if (mode === 'mock') saveLocal(STORAGE_KEYS.battles, next)
    },
    [mode],
  )

  const persistProfiles = useCallback(
    (next) => {
      setProfilesState(next)
      if (mode === 'mock') saveLocal(STORAGE_KEYS.profiles, next)
    },
    [mode],
  )

  // Land markeren als bezocht door een speler.
  const setVisited = useCallback(
    async (player, code, name) => {
      const id = visitedKey(player, code)
      const existing = visited[id] || {}
      const docData = {
        player,
        countryCode: String(code),
        countryName: name,
        visited: true,
        note: existing.note || '',
        memory: existing.memory || '',
        visitDate: existing.visitDate || '',
        imageUrl: existing.imageUrl || '',
        createdAt:
          existing.createdAt || (mode === 'firebase' ? serverTimestamp() : new Date().toISOString()),
        updatedAt: mode === 'firebase' ? serverTimestamp() : new Date().toISOString(),
      }
      if (mode === 'firebase') {
        await setDoc(doc(db, 'visitedCountries', id), docData, { merge: true })
      } else {
        persistVisited({ ...visited, [id]: docData })
      }
    },
    [visited, mode, persistVisited],
  )

  // Land verwijderen uit de bezochte landen van een speler.
  const removeVisited = useCallback(
    async (player, code) => {
      const id = visitedKey(player, code)
      if (mode === 'firebase') {
        await deleteDoc(doc(db, 'visitedCountries', id))
      } else {
        const next = { ...visited }
        delete next[id]
        persistVisited(next)
      }
    },
    [visited, mode, persistVisited],
  )

  // Notitie / herinnering / datum / afbeelding-URL bijwerken.
  const updateVisitedFields = useCallback(
    async (player, code, fields) => {
      const id = visitedKey(player, code)
      if (mode === 'firebase') {
        await updateDoc(doc(db, 'visitedCountries', id), {
          ...fields,
          updatedAt: serverTimestamp(),
        })
      } else {
        const existing = visited[id] || {}
        persistVisited({
          ...visited,
          [id]: { ...existing, ...fields, updatedAt: new Date().toISOString() },
        })
      }
    },
    [visited, mode, persistVisited],
  )

  // Battle-antwoorden opslaan + scores en winnaar (her)berekenen.
  const saveBattleAnswers = useCallback(
    async (player, code, name, answers) => {
      const id = String(code)
      const existing = battles[id] || {}
      const floorAnswers = player === PLAYERS.FLOOR ? answers : existing.floorAnswers || null
      const tomAnswers = player === PLAYERS.TOM ? answers : existing.tomAnswers || null
      const floorScore = floorAnswers ? computeBattleScore(floorAnswers) : null
      const tomScore = tomAnswers ? computeBattleScore(tomAnswers) : null
      const winner = determineWinner(floorScore, tomScore)
      const docData = {
        countryCode: id,
        countryName: name,
        floorAnswers,
        tomAnswers,
        floorScore,
        tomScore,
        winner,
        updatedAt: mode === 'firebase' ? serverTimestamp() : new Date().toISOString(),
      }
      if (mode === 'firebase') {
        await setDoc(doc(db, 'countryBattles', id), docData, { merge: true })
      } else {
        persistBattles({ ...battles, [id]: { ...existing, ...docData } })
      }
    },
    [battles, mode, persistBattles],
  )

  // Profielfoto (avatar) van een speler opslaan — gedeeld, zodat de ander het ziet.
  const setProfileAvatar = useCallback(
    async (player, avatarId) => {
      const docData = {
        player,
        avatarId,
        updatedAt: mode === 'firebase' ? serverTimestamp() : new Date().toISOString(),
      }
      if (mode === 'firebase') {
        await setDoc(doc(db, 'profiles', player), docData, { merge: true })
      } else {
        persistProfiles({ ...profiles, [player]: docData })
      }
    },
    [profiles, mode, persistProfiles],
  )

  // Alleen voor demo-modus: zet de mock data terug naar de uitgangssituatie.
  const resetMockData = useCallback(() => {
    if (mode !== 'mock') return
    saveLocal(STORAGE_KEYS.visited, SEED_VISITED)
    saveLocal(STORAGE_KEYS.battles, SEED_BATTLES)
    setVisitedState(SEED_VISITED)
    setBattlesState(SEED_BATTLES)
  }, [mode])

  return {
    mode,
    loading,
    error,
    visited,
    battles,
    profiles,
    setVisited,
    removeVisited,
    updateVisitedFields,
    saveBattleAnswers,
    setProfileAvatar,
    resetMockData,
  }
}

