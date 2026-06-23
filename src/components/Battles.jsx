import { sharedCountries } from '../utils/countryStatus'
import { flagEmoji } from '../data/countryMetadata'

// Battles-overzicht: alle gedeelde landen met hun battle-status.
export default function Battles({ visited, battles, onSelect }) {
  const shared = sharedCountries(visited)

  return (
    <div className="battles-view">
      <div className="battles-view__intro">
        <h2>⚔️ Landenbattles</h2>
        <p>
          Landen waar jullie allebei zijn geweest. Beantwoord de vragen en bepaal wie het
          land verdient. Beige tegen blauw.
        </p>
      </div>

      {shared.length === 0 ? (
        <p className="overview__empty">
          Nog geen gedeelde landen. Ga eerst samen (of allebei apart) ergens heen!
        </p>
      ) : (
        <ul className="battle-list">
          {shared.map(({ code, name }) => {
            const b = battles[code]
            const floorAnswered = !!b?.floorAnswers
            const tomAnswered = !!b?.tomAnswers
            let statusText = 'Nog niet gestart'
            let statusClass = 'open'
            if (b?.winner === 'Floor' || b?.winner === 'Tom') {
              statusText = `Gewonnen door ${b.winner}`
              statusClass = b.winner.toLowerCase()
            } else if (b?.winner === 'Tie') {
              statusText = 'Gelijkspel'
              statusClass = 'tie'
            } else if (floorAnswered && !tomAnswered) {
              statusText = 'Wachten op Tom'
              statusClass = 'waiting'
            } else if (!floorAnswered && tomAnswered) {
              statusText = 'Wachten op Floor'
              statusClass = 'waiting'
            }

            return (
              <li key={code}>
                <button
                  type="button"
                  className="battle-list__item"
                  onClick={() => onSelect(code, name)}
                >
                  <span className="battle-list__flag">{flagEmoji(code)}</span>
                  <span className="battle-list__name">{name}</span>
                  <span className={`battle-list__status battle-list__status--${statusClass}`}>
                    {b?.winner === 'Floor' || b?.winner === 'Tom' ? '👑 ' : ''}
                    {statusText}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

