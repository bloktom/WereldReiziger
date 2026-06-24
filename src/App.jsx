import { useCallback, useEffect, useState } from 'react'
import PlayerSelect from './components/PlayerSelect'
import HeaderScore from './components/HeaderScore'
import NavMenu from './components/NavMenu'
import WorldMap from './components/WorldMap'
import CountryDetailPanel from './components/CountryDetailPanel'
import Scoreboard from './components/Scoreboard'
import Battles from './components/Battles'
import Memories from './components/Memories'
import Settings from './components/Settings'
import Toast from './components/Toast'
import AvatarPicker from './components/AvatarPicker'
import { useTravelData } from './hooks/useTravelData'
import { firebaseProjectId } from './firebase'
import { loadAvatar, saveAvatar } from './data/avatars'
import { PLAYERS, STORAGE_KEYS, VIEWS } from './utils/constants'

export default function App() {
  const [player, setPlayer] = useState(() => localStorage.getItem(STORAGE_KEYS.player) || null)
  const [view, setView] = useState(VIEWS.MAP)
  const [selected, setSelected] = useState(null) // { code, name }
  const [toast, setToast] = useState('')
  // Gekozen profielfoto per speler (uit localStorage).
  const [avatars, setAvatars] = useState(() => ({
    [PLAYERS.FLOOR]: loadAvatar(PLAYERS.FLOOR),
    [PLAYERS.TOM]: loadAvatar(PLAYERS.TOM),
  }))
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const data = useTravelData()

  const showToast = useCallback((msg) => setToast(msg), [])

  // Profielfoto van de actieve speler wijzigen + onthouden.
  const setAvatar = useCallback((p, id) => {
    saveAvatar(p, id)
    setAvatars((prev) => ({ ...prev, [p]: id }))
  }, [])

  // Speler kiezen + onthouden in localStorage.
  const choosePlayer = useCallback((p) => {
    localStorage.setItem(STORAGE_KEYS.player, p)
    setPlayer(p)
    setToast(`Je speelt als ${p}.`)
  }, [])

  const switchPlayer = useCallback(() => {
    setPlayer((prev) => {
      const next = prev === PLAYERS.FLOOR ? PLAYERS.TOM : PLAYERS.FLOOR
      localStorage.setItem(STORAGE_KEYS.player, next)
      setToast(`Gewisseld: je speelt nu als ${next}.`)
      return next
    })
  }, [])

  const openCountry = useCallback((code, name) => {
    setSelected({ code: String(code), name })
  }, [])

  // Sluit het detailpaneel met Escape.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSelected(null)
        setShowAvatarPicker(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Nog geen speler gekozen? Toon het keuzescherm.
  if (!player) {
    return (
      <>
        <PlayerSelect onChoose={choosePlayer} />
        <Toast message={toast} onDone={() => setToast('')} />
      </>
    )
  }

  return (
    <div className={`app app--${player.toLowerCase()}`}>
      <HeaderScore
        visited={data.visited}
        player={player}
        avatarId={avatars[player]}
        onSwitchPlayer={switchPlayer}
        onAvatarClick={() => setShowAvatarPicker(true)}
      />
      <NavMenu view={view} onChange={setView} />

      {data.mode === 'mock' && (
        <div className="demo-banner">
          🧪 Demo-modus actief — data staat alleen in deze browser. Koppel Firebase (zie
          README) zodat Floor en Tom elkaars landen zien.
        </div>
      )}
      {data.error && (
        <div className="demo-banner demo-banner--error">
          ⚠️ Fout bij online opslag: {data.error}
          {/permission|insufficient|PERMISSION_DENIED/i.test(data.error) && (
            <div className="demo-banner__hint">
              De Firestore-regels blokkeren toegang. Controleer in de{' '}
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noreferrer"
              >
                Firebase Console
              </a>
              : <strong>1)</strong> staan de regels in project <code>{firebaseProjectId}</code>?{' '}
              <strong>2)</strong> heb je op <strong>Publish/Publiceren</strong> geklikt?{' '}
              <strong>3)</strong> is de database de <code>(default)</code>-database? Plak deze
              regels en publiceer ze:
              <pre className="demo-banner__code">{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}</pre>
            </div>
          )}
        </div>
      )}

      <main className="app__main">
        {data.loading ? (
          <div className="loading">
            <span className="loading__spinner" /> Reisdata laden...
          </div>
        ) : (
          <>
            {view === VIEWS.MAP && (
              <WorldMap visited={data.visited} battles={data.battles} onSelect={openCountry} />
            )}
            {view === VIEWS.SCOREBOARD && (
              <Scoreboard visited={data.visited} battles={data.battles} onSelect={openCountry} />
            )}
            {view === VIEWS.BATTLES && (
              <Battles visited={data.visited} battles={data.battles} onSelect={openCountry} />
            )}
            {view === VIEWS.MEMORIES && <Memories visited={data.visited} onSelect={openCountry} />}
            {view === VIEWS.SETTINGS && (
              <Settings
                player={player}
                mode={data.mode}
                avatarId={avatars[player]}
                onSelectAvatar={(id) => setAvatar(player, id)}
                onSwitchPlayer={switchPlayer}
                onResetMock={data.resetMockData}
              />
            )}
          </>
        )}
      </main>

      {selected && (
        <CountryDetailPanel
          country={selected}
          player={player}
          data={data}
          onClose={() => setSelected(null)}
          showToast={showToast}
        />
      )}

      {showAvatarPicker && (
        <>
          <div className="panel-overlay" onClick={() => setShowAvatarPicker(false)} />
          <div className="avatar-modal" role="dialog" aria-label="Kies je profielfoto">
            <div className="avatar-modal__header">
              <h2>Profielfoto van {player}</h2>
              <button
                type="button"
                className="panel__close"
                onClick={() => setShowAvatarPicker(false)}
                aria-label="Sluiten"
              >
                ✕
              </button>
            </div>
            <p className="avatar-modal__hint">
              {player === PLAYERS.FLOOR
                ? 'Kies een foto die past bij je roze territorium.'
                : 'Kies een foto met smaak, blauw uiteraard.'}
            </p>
            <AvatarPicker
              player={player}
              current={avatars[player]}
              onSelect={(id) => {
                setAvatar(player, id)
                setToast('Profielfoto bijgewerkt!')
              }}
            />
          </div>
        </>
      )}

      <Toast message={toast} onDone={() => setToast('')} />
    </div>
  )
}

