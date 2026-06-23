import { VIEWS } from '../utils/constants'

const ITEMS = [
  { id: VIEWS.MAP, label: 'Wereldkaart', icon: '🗺️' },
  { id: VIEWS.SCOREBOARD, label: 'Scorebord', icon: '🏆' },
  { id: VIEWS.BATTLES, label: 'Battles', icon: '⚔️' },
  { id: VIEWS.MEMORIES, label: 'Herinneringen', icon: '📸' },
  { id: VIEWS.SETTINGS, label: 'Instellingen', icon: '⚙️' },
]

// Hoofdmenu met de vijf hoofdsecties.
export default function NavMenu({ view, onChange }) {
  return (
    <nav className="nav" aria-label="Hoofdmenu">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`nav__btn ${view === item.id ? 'nav__btn--active' : ''}`}
          onClick={() => onChange(item.id)}
        >
          <span className="nav__icon" aria-hidden="true">
            {item.icon}
          </span>
          <span className="nav__label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

