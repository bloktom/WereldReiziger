import { PLAYERS } from '../utils/constants'
import { countVisited, sharedCountryCodes } from '../utils/countryStatus'
import { getScoreStatus } from '../data/funnyMessages'
import Avatar from './Avatar'

// Scorebalk bovenin: Floor vs Tom, wie staat voor, hoeveel gedeeld.
export default function HeaderScore({ visited, player, avatarId, onSwitchPlayer, onAvatarClick }) {
  const floorCount = countVisited(visited, PLAYERS.FLOOR)
  const tomCount = countVisited(visited, PLAYERS.TOM)
  const shared = sharedCountryCodes(visited).length
  const status = getScoreStatus(floorCount, tomCount)

  return (
    <header className="header-score">
      <div className="header-score__top">
        <div className="header-score__brand">
          <span className="header-score__globe">🌍</span>
          <div>
            <h1 className="header-score__title">Floor vs Tom</h1>
            <p className="header-score__subtitle">De Grote Reisstrijd</p>
          </div>
        </div>

        <div className="header-score__pills">
          <div className="score-pill score-pill--floor">
            <span className="score-pill__name">Floor</span>
            <span className="score-pill__value">{floorCount}</span>
            <span className="score-pill__label">landen</span>
          </div>
          <span className="score-vs">vs</span>
          <div className="score-pill score-pill--tom">
            <span className="score-pill__name">Tom</span>
            <span className="score-pill__value">{tomCount}</span>
            <span className="score-pill__label">landen</span>
          </div>
        </div>

        <div className="header-score__me">
          <Avatar
            player={player}
            avatarId={avatarId}
            size={42}
            onClick={onAvatarClick}
            title="Wijzig je profielfoto"
          />
          <span className={`me-badge me-badge--${player.toLowerCase()}`}>
            Jij speelt als {player}
          </span>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onSwitchPlayer}>
            Wissel
          </button>
        </div>
      </div>

      <div className="header-score__status">
        <span className="header-score__shared">🤝 {shared} samen bezocht</span>
        <span className="header-score__quip">{status}</span>
      </div>
    </header>
  )
}

