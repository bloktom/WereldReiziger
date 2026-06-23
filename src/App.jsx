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
import { useTravelData } from './hooks/useTravelData'
import { PLAYERS, STORAGE_KEYS, VIEWS } from './utils/constants'

export default function App() {
  const [player, setPlayer] = useState(() => localStorage.getItem(STORAGE_KEYS.player) || null)
  const [view, setView] = useState(VIEWS.MAP)
  const [selected, setSelected] = useState(null) // { code, name }
  const [toast, setToast] = useState('')
  const data = useTravelData()

  const showToast = useCallback((msg) => setToast(msg), [])

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
    const onKey = (e) => e.key === 'Escape' && setSelected(null)
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
      <HeaderScore visited={data.visited} player={player} onSwitchPlayer={switchPlayer} />
      <NavMenu view={view} onChange={setView} />

      {data.mode === 'mock' && (
        <div className="demo-banner">
          🧪 Demo-modus actief — data staat alleen in deze browser. Koppel Firebase (zie
          README) zodat Floor en Tom elkaars landen zien.
        </div>
      )}
      {data.error && (
        <div className="demo-banner demo-banner--error">⚠️ Fout bij online opslag: {data.error}</div>
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

      <Toast message={toast} onDone={() => setToast('')} />
    </div>
  )
}

