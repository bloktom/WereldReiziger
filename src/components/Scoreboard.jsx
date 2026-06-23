import { PLAYERS } from '../utils/constants'
import {
  countVisited,
  sharedCountries,
  visitedListForPlayer,
} from '../utils/countryStatus'
import { flagEmoji } from '../data/countryMetadata'
import { getScoreStatus } from '../data/funnyMessages'

function Chip({ code, name, variant, onClick }) {
  return (
    <button type="button" className={`chip chip--${variant}`} onClick={onClick}>
      <span className="chip__flag">{flagEmoji(code)}</span>
      {name}
    </button>
  )
}

function Section({ title, hint, items, variant, onSelect, empty }) {
  return (
    <section className="overview__section">
      <header className="overview__head">
        <h3>{title}</h3>
        <span className="overview__count">{items.length}</span>
      </header>
      {hint && <p className="overview__hint">{hint}</p>}
      {items.length === 0 ? (
        <p className="overview__empty">{empty}</p>
      ) : (
        <div className="chips">
          {items.map((it) => (
            <Chip
              key={`${variant}-${it.code}`}
              code={it.code}
              name={it.name}
              variant={variant}
              onClick={() => onSelect(it.code, it.name)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

// Overzichtspagina (item 9): alle lijstjes op een rij.
export default function Scoreboard({ visited, battles, onSelect }) {
  const floorCount = countVisited(visited, PLAYERS.FLOOR)
  const tomCount = countVisited(visited, PLAYERS.TOM)

  const floorList = visitedListForPlayer(visited, PLAYERS.FLOOR).map((d) => ({
    code: d.countryCode,
    name: d.countryName,
  }))
  const tomList = visitedListForPlayer(visited, PLAYERS.TOM).map((d) => ({
    code: d.countryCode,
    name: d.countryName,
  }))
  const shared = sharedCountries(visited)

  const wonByFloor = []
  const wonByTom = []
  Object.values(battles).forEach((b) => {
    if (!b) return
    if (b.winner === 'Floor') wonByFloor.push({ code: b.countryCode, name: b.countryName })
    if (b.winner === 'Tom') wonByTom.push({ code: b.countryCode, name: b.countryName })
  })

  const openBattles = shared.filter((c) => {
    const b = battles[c.code]
    return !b || !b.winner || b.winner == null
  })

  return (
    <div className="overview">
      <div className="overview__summary">
        <div className="score-pill score-pill--floor score-pill--big">
          <span className="score-pill__name">Floor</span>
          <span className="score-pill__value">{floorCount}</span>
          <span className="score-pill__label">landen</span>
        </div>
        <div className="overview__quip">{getScoreStatus(floorCount, tomCount)}</div>
        <div className="score-pill score-pill--tom score-pill--big">
          <span className="score-pill__name">Tom</span>
          <span className="score-pill__value">{tomCount}</span>
          <span className="score-pill__label">landen</span>
        </div>
      </div>

      <div className="overview__grid">
        <Section
          title="Floor-territorium"
          hint="Beige, de kleur van die muur."
          items={floorList}
          variant="floor"
          onSelect={onSelect}
          empty="Nog niets. Onwaarschijnlijk."
        />
        <Section
          title="Tom-territorium"
          hint="Blauw, met smaak."
          items={tomList}
          variant="tom"
          onSelect={onSelect}
          empty="Tom moet nog beginnen."
        />
        <Section
          title="Samen bezocht"
          hint="Hier kan een battle losbarsten."
          items={shared}
          variant="both"
          onSelect={onSelect}
          empty="Nog geen gedeelde landen."
        />
        <Section
          title="Gewonnen door Floor"
          items={wonByFloor}
          variant="floor"
          onSelect={onSelect}
          empty="Nog geen overwinningen."
        />
        <Section
          title="Gewonnen door Tom"
          items={wonByTom}
          variant="tom"
          onSelect={onSelect}
          empty="Nog geen overwinningen."
        />
        <Section
          title="Open battles"
          hint="Gedeelde landen die nog beslist moeten worden."
          items={openBattles}
          variant="both"
          onSelect={onSelect}
          empty="Geen openstaande battles."
        />
      </div>
    </div>
  )
}

