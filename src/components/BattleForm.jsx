import { useState } from 'react'
import { PLAYERS } from '../utils/constants'
import { getBattleMessage } from '../data/funnyMessages'
import { humanizeError } from '../utils/format'

const EMPTY = {
  duration: '',
  places: '',
  localFood: false,
  culture: false,
  adventure: false,
  story: '',
  rating: 7,
}

// Landenbattle: beide spelers vullen vragen in, daarna bepaalt het puntensysteem
// wie het land "wint".
export default function BattleForm({ code, name, player, battle, onSave, showToast }) {
  const myKey = player === PLAYERS.FLOOR ? 'floorAnswers' : 'tomAnswers'
  const [answers, setAnswers] = useState(() => ({ ...EMPTY, ...(battle?.[myKey] || {}) }))

  const set = (field, value) => setAnswers((a) => ({ ...a, [field]: value }))

  const handleSave = async () => {
    const clean = {
      duration: Number(answers.duration) || 0,
      places: Number(answers.places) || 0,
      localFood: !!answers.localFood,
      culture: !!answers.culture,
      adventure: !!answers.adventure,
      story: String(answers.story || '').trim(),
      rating: Number(answers.rating) || 0,
    }
    try {
      await onSave(player, code, name, clean)
      showToast?.('Battle-antwoorden opgeslagen. Spannend!')
    } catch (e) {
      showToast?.(humanizeError(e))
    }
  }

  const floorAnswered = !!battle?.floorAnswers
  const tomAnswered = !!battle?.tomAnswers
  const bothAnswered = floorAnswered && tomAnswered
  const winner = battle?.winner

  return (
    <div className="battle">
      <h4 className="battle__title">⚔️ Landenbattle: wie wint {name}?</h4>
      <p className="battle__intro">
        Allebei hier geweest! Vul je antwoorden in en claim dit land.
      </p>

      <div className="battle__form">
        <label className="field">
          <span>Hoe lang ben je er geweest? (dagen)</span>
          <input
            type="number"
            min="0"
            value={answers.duration}
            onChange={(e) => set('duration', e.target.value)}
          />
        </label>

        <label className="field">
          <span>Hoeveel steden/plekken bezocht?</span>
          <input
            type="number"
            min="0"
            value={answers.places}
            onChange={(e) => set('places', e.target.value)}
          />
        </label>

        <div className="battle__checks">
          <label className="check">
            <input
              type="checkbox"
              checked={answers.localFood}
              onChange={(e) => set('localFood', e.target.checked)}
            />
            <span>Lokaal eten geprobeerd</span>
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={answers.culture}
              onChange={(e) => set('culture', e.target.checked)}
            />
            <span>Iets cultureels bezocht</span>
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={answers.adventure}
              onChange={(e) => set('adventure', e.target.checked)}
            />
            <span>Iets avontuurlijks gedaan</span>
          </label>
        </div>

        <label className="field">
          <span>Grappig of bijzonder verhaal? (bonuspunt)</span>
          <textarea
            rows="2"
            value={answers.story}
            onChange={(e) => set('story', e.target.value)}
            placeholder="Vertel..."
          />
        </label>

        <label className="field">
          <span>Jouw ervaring: {answers.rating}/10</span>
          <input
            type="range"
            min="1"
            max="10"
            value={answers.rating}
            onChange={(e) => set('rating', e.target.value)}
          />
        </label>

        <button type="button" className={`btn btn--${player.toLowerCase()}`} onClick={handleSave}>
          Mijn antwoorden opslaan
        </button>
      </div>

      <div className="battle__result">
        {!bothAnswered ? (
          <p className="battle__waiting">
            {!floorAnswered && '⏳ Wachten op Floor'}
            {!floorAnswered && !tomAnswered && ' & '}
            {!tomAnswered && '⏳ Wachten op Tom'}
          </p>
        ) : (
          <>
            <div className="battle__scores">
              <span className="badge badge--floor">Floor: {battle.floorScore} pt</span>
              <span className="badge badge--tom">Tom: {battle.tomScore} pt</span>
            </div>
            <p className={`battle__winner battle__winner--${(winner || 'tie').toLowerCase()}`}>
              {winner === 'Tie' ? '🤝 Gelijkspel!' : `🏆 ${winner} wint dit land!`}
            </p>
            <p className="battle__quip">{getBattleMessage(winner)}</p>
          </>
        )}
      </div>
    </div>
  )
}

