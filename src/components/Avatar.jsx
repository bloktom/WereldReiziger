import { useEffect, useState } from 'react'
import { DEFAULT_AVATAR_EMOJI, findAvatar } from '../data/avatars'

// Ronde profielfoto/icoon voor een speler. Toont de gekozen foto, of een
// simpel standaard-icoon (👤) als er niets gekozen is of de foto niet laadt.
export default function Avatar({ player, avatarId, size = 40, onClick, title, className = '' }) {
  const [failed, setFailed] = useState(false)
  const option = findAvatar(player, avatarId)
  const showImage = option && !failed

  // Reset de foutstatus als de keuze of speler verandert.
  useEffect(() => setFailed(false), [avatarId, player])

  const inner = showImage ? (
    <img
      className="avatar__img"
      src={option.url}
      alt={`Profielfoto van ${player}`}
      onError={() => setFailed(true)}
      draggable={false}
    />
  ) : (
    <span className="avatar__emoji" aria-hidden="true">
      {DEFAULT_AVATAR_EMOJI}
    </span>
  )

  const style = { width: size, height: size, fontSize: Math.round(size * 0.55) }
  const classes = `avatar avatar--${player.toLowerCase()} ${onClick ? 'avatar--button' : ''} ${className}`.trim()

  if (onClick) {
    return (
      <button type="button" className={classes} style={style} onClick={onClick} title={title} aria-label={title || `Profielfoto van ${player}`}>
        {inner}
      </button>
    )
  }
  return (
    <span className={classes} style={style} title={title}>
      {inner}
    </span>
  )
}

