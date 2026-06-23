import { useMemo, useState } from 'react'
import { PLAYERS } from '../utils/constants'
import { sharedCountryCodes } from '../utils/countryStatus'
import { flagEmoji } from '../data/countryMetadata'
import { formatDate } from '../utils/format'

// Herinneringen-pagina: alle notities & herinneringen, filterbaar.
export default function Memories({ visited, onSelect }) {
  const [filter, setFilter] = useState('all') // all | Floor | Tom | shared
  const [search, setSearch] = useState('')

  const sharedSet = useMemo(() => new Set(sharedCountryCodes(visited)), [visited])

  const items = useMemo(() => {
    const list = Object.values(visited).filter((d) => d && d.visited && (d.note || d.memory || d.imageUrl))
    return list
      .filter((d) => {
        if (filter === PLAYERS.FLOOR) return d.player === PLAYERS.FLOOR
        if (filter === PLAYERS.TOM) return d.player === PLAYERS.TOM
        if (filter === 'shared') return sharedSet.has(String(d.countryCode))
        return true
      })
      .filter((d) =>
        search ? (d.countryName || '').toLowerCase().includes(search.toLowerCase()) : true,
      )
      .sort((a, b) => (a.countryName || '').localeCompare(b.countryName || ''))
  }, [visited, filter, search, sharedSet])

  return (
    <div className="memories">
      <div className="memories__intro">
        <h2>📸 Herinneringen</h2>
        <p>Alle notities en mooie momenten van Floor en Tom op een rij.</p>
      </div>

      <div className="filter-bar">
        <div className="filter-bar__chips">
          {[
            { id: 'all', label: 'Alles' },
            { id: PLAYERS.FLOOR, label: 'Floor' },
            { id: PLAYERS.TOM, label: 'Tom' },
            { id: 'shared', label: 'Gedeeld' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter-chip ${filter === f.id ? 'is-active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          className="filter-bar__search"
          placeholder="Zoek op land..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {items.length === 0 ? (
        <p className="overview__empty">
          Nog geen herinneringen. Open een land op de kaart en voeg een notitie toe.
        </p>
      ) : (
        <div className="memory-grid">
          {items.map((d) => (
            <article
              key={`${d.player}_${d.countryCode}`}
              className={`memory-card memory-card--${d.player.toLowerCase()}`}
            >
              {d.imageUrl ? (
                <img className="memory-card__img" src={d.imageUrl} alt={d.countryName} />
              ) : null}
              <div className="memory-card__body">
                <button
                  type="button"
                  className="memory-card__title"
                  onClick={() => onSelect(String(d.countryCode), d.countryName)}
                >
                  <span>{flagEmoji(d.countryCode)}</span> {d.countryName}
                </button>
                <span className={`badge badge--${d.player.toLowerCase()}`}>{d.player}</span>
                {d.note && (
                  <p className="memory-card__note">{d.note}</p>
                )}
                {d.memory && (
                  <p className="memory-card__memory">“{d.memory}”</p>
                )}
                {(d.visitDate || d.createdAt) && (
                  <p className="memory-card__date">
                    {d.visitDate || formatDate(d.createdAt)}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

