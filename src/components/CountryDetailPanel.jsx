import { useEffect, useState } from 'react'
import { PLAYERS } from '../utils/constants'
import { getCountryStatus, getVisitedDoc } from '../utils/countryStatus'
import { flagEmoji, isCoastal } from '../data/countryMetadata'
import { getMarkMessage } from '../data/funnyMessages'
import { formatDate } from '../utils/format'
import BattleForm from './BattleForm'

// Detailpaneel voor één land: status, notities, acties en eventueel de battle.
export default function CountryDetailPanel({ country, player, data, onClose, showToast }) {
  const { code, name } = country
  const { visited, battles } = data
  const status = getCountryStatus(code, visited)
  const floorDoc = getVisitedDoc(visited, PLAYERS.FLOOR, code)
  const tomDoc = getVisitedDoc(visited, PLAYERS.TOM, code)
  const myDoc = player === PLAYERS.FLOOR ? floorDoc : tomDoc
  const otherDoc = player === PLAYERS.FLOOR ? tomDoc : floorDoc
  const otherName = player === PLAYERS.FLOOR ? PLAYERS.TOM : PLAYERS.FLOOR
  const battle = battles[code]

  // Lokale velden voor notitie/herinnering/datum/afbeelding van de actieve speler.
  const [fields, setFields] = useState({ note: '', memory: '', visitDate: '', imageUrl: '' })

  useEffect(() => {
    setFields({
      note: myDoc?.note || '',
      memory: myDoc?.memory || '',
      visitDate: myDoc?.visitDate || '',
      imageUrl: myDoc?.imageUrl || '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, player, myDoc?.note, myDoc?.memory, myDoc?.visitDate, myDoc?.imageUrl])

  const statusLabel = {
    none: 'Nog niet bezocht',
    floor: 'Bezocht door Floor',
    tom: 'Bezocht door Tom',
    both: 'Bezocht door allebei',
  }[status.status]

  const handleMarkVisited = async () => {
    await data.setVisited(player, code, name)
    showToast(getMarkMessage(player, isCoastal(code)))
  }

  const handleRemove = async () => {
    if (!window.confirm(`Weet je zeker dat je ${name} uit jouw bezochte landen wilt halen?`)) return
    await data.removeVisited(player, code)
    showToast(`${name} verwijderd uit jouw landen.`)
  }

  const handleSaveFields = async () => {
    await data.updateVisitedFields(player, code, fields)
    showToast('Opgeslagen!')
  }

  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <aside className="panel" role="dialog" aria-label={`Details voor ${name}`}>
        <div className="panel__header">
          <div className="panel__title">
            <span className="panel__flag">{flagEmoji(code)}</span>
            <h2>{name}</h2>
          </div>
          <button type="button" className="panel__close" onClick={onClose} aria-label="Sluiten">
            ✕
          </button>
        </div>

        <div className="panel__body">
          <div className="panel__badges">
            <span className={`badge badge--${status.status}`}>{statusLabel}</span>
            {floorDoc && <span className="badge badge--floor">Floor ✓</span>}
            {tomDoc && <span className="badge badge--tom">Tom ✓</span>}
            {isCoastal(code) && <span className="badge badge--sea">🌊 Aan zee</span>}
          </div>

          {/* Acties voor de actieve speler */}
          <section className="panel__section">
            <h3>Jij speelt als {player}</h3>
            {myDoc ? (
              <>
                <p className="panel__meta">
                  Toegevoegd: {formatDate(myDoc.createdAt) || 'onbekend'}
                </p>

                <label className="field">
                  <span>Datum van bezoek</span>
                  <input
                    type="date"
                    value={fields.visitDate || ''}
                    onChange={(e) => setFields((f) => ({ ...f, visitDate: e.target.value }))}
                  />
                </label>

                <label className="field">
                  <span>Notitie</span>
                  <textarea
                    rows="2"
                    value={fields.note}
                    onChange={(e) => setFields((f) => ({ ...f, note: e.target.value }))}
                    placeholder="Wat moet je over dit land onthouden?"
                  />
                </label>

                <label className="field">
                  <span>Favoriete herinnering</span>
                  <textarea
                    rows="2"
                    value={fields.memory}
                    onChange={(e) => setFields((f) => ({ ...f, memory: e.target.value }))}
                    placeholder="Je mooiste moment hier..."
                  />
                </label>

                <label className="field">
                  <span>Afbeelding-URL (optioneel)</span>
                  <input
                    type="url"
                    value={fields.imageUrl}
                    onChange={(e) => setFields((f) => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="https://..."
                  />
                </label>

                {fields.imageUrl ? (
                  <img className="panel__image" src={fields.imageUrl} alt={`Herinnering aan ${name}`} />
                ) : null}

                <div className="panel__actions">
                  <button type="button" className="btn btn--primary" onClick={handleSaveFields}>
                    Opslaan
                  </button>
                  <button type="button" className="btn btn--danger" onClick={handleRemove}>
                    Verwijder uit mijn landen
                  </button>
                </div>
              </>
            ) : (
              <button type="button" className={`btn btn--${player.toLowerCase()} btn--block`} onClick={handleMarkVisited}>
                Markeer {name} als bezocht
              </button>
            )}
          </section>

          {/* Wat de andere speler heeft achtergelaten */}
          {otherDoc && (otherDoc.note || otherDoc.memory) ? (
            <section className="panel__section panel__section--muted">
              <h3>{otherName}&apos;s aantekeningen</h3>
              {otherDoc.note && (
                <p>
                  <strong>Notitie:</strong> {otherDoc.note}
                </p>
              )}
              {otherDoc.memory && (
                <p>
                  <strong>Herinnering:</strong> {otherDoc.memory}
                </p>
              )}
              {otherDoc.visitDate && (
                <p className="panel__meta">Bezocht: {otherDoc.visitDate}</p>
              )}
            </section>
          ) : null}

          {/* Battle: alleen als beide spelers er geweest zijn */}
          {status.both ? (
            <section className="panel__section">
              <BattleForm
                code={code}
                name={name}
                player={player}
                battle={battle}
                onSave={data.saveBattleAnswers}
                showToast={showToast}
              />
            </section>
          ) : status.status !== 'none' ? (
            <p className="panel__hint">
              Zodra jullie hier allebei zijn geweest, kun je dit land claimen via de landenbattle.
            </p>
          ) : null}
        </div>
      </aside>
    </>
  )
}

