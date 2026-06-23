import { WELCOME_TEXT } from '../data/funnyMessages'
import { PLAYERS } from '../utils/constants'

// Eerste scherm: wie ben jij? Floor of Tom?
export default function PlayerSelect({ onChoose }) {
  return (
    <div className="player-select">
      <div className="player-select__inner">
        <div className="player-select__intro">
          <span className="player-select__emoji">🌍</span>
          <h1>Floor vs Tom</h1>
          <p className="player-select__tag">De Grote Reisstrijd</p>
          <p className="player-select__welcome">{WELCOME_TEXT}</p>
          <p className="player-select__hint">Kies wie je bent om te beginnen:</p>
        </div>

        <div className="player-select__cards">
          <button
            type="button"
            className="player-card player-card--floor"
            onClick={() => onChoose(PLAYERS.FLOOR)}
          >
            <span className="player-card__avatar">🧳</span>
            <span className="player-card__name">Floor</span>
            <span className="player-card__desc">
              Speelt in beige, de offici&euml;le kleur van haar twijfelachtige muur.
            </span>
          </button>

          <span className="player-select__vs">vs</span>

          <button
            type="button"
            className="player-card player-card--tom"
            onClick={() => onChoose(PLAYERS.TOM)}
          >
            <span className="player-card__avatar">🧭</span>
            <span className="player-card__name">Tom</span>
            <span className="player-card__desc">
              Speelt in blauw, omdat iemand hier tenminste smaak heeft.
            </span>
          </button>
        </div>

        <p className="player-select__footer">
          Je keuze wordt onthouden. Wisselen kan altijd via Instellingen.
        </p>
      </div>
    </div>
  )
}

