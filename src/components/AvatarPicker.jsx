import { AVATARS, DEFAULT_AVATAR_EMOJI, DEFAULT_AVATAR_ID } from '../data/avatars'

// Keuzeraster met profielfoto's voor een speler (plus het standaard-icoon).
// Wordt zowel los (in Instellingen) als in een pop-up (vanuit de header) gebruikt.
export default function AvatarPicker({ player, current, onSelect }) {
  const options = AVATARS[player] || []

  return (
    <div className="avatar-picker">
      <button
        type="button"
        className={`avatar-option ${current === DEFAULT_AVATAR_ID ? 'is-selected' : ''}`}
        onClick={() => onSelect(DEFAULT_AVATAR_ID)}
        title="Standaard icoon"
      >
        <span className={`avatar-option__media avatar-option__media--default avatar-option--${player.toLowerCase()}`}>
          {DEFAULT_AVATAR_EMOJI}
        </span>
        <span className="avatar-option__label">Standaard</span>
      </button>

      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`avatar-option ${current === opt.id ? 'is-selected' : ''}`}
          onClick={() => onSelect(opt.id)}
          title={opt.label}
        >
          <span className={`avatar-option__media avatar-option--${player.toLowerCase()}`}>
            <img src={opt.url} alt={opt.label} loading="lazy" draggable={false} />
          </span>
          <span className="avatar-option__label">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}

