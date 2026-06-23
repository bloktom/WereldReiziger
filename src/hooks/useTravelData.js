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
    return () => {
      unsubVisited()
      unsubBattles()
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
    setVisited,
    removeVisited,
    updateVisitedFields,
    saveBattleAnswers,
    resetMockData,
  }
}

