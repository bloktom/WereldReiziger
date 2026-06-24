import { PLAYERS } from '../utils/constants'

// Instellingen: speler wisselen, demo-modus uitleg, data resetten.
export default function Settings({ player, mode, onSwitchPlayer, onResetMock }) {
  const other = player === PLAYERS.FLOOR ? PLAYERS.TOM : PLAYERS.FLOOR

  return (
    <div className="settings">
      <div className="settings__intro">
        <h2>⚙️ Instellingen</h2>
        <p>Beheer je speler en bekijk de status van de online opslag.</p>
      </div>

      <section className="settings__card">
        <h3>Speler</h3>
        <p>
          Je speelt nu als <strong>{player}</strong>.{' '}
          {player === PLAYERS.FLOOR
            ? 'Lichtroze, de officiële kleur van je muur.'
            : 'Blauw, omdat iemand hier tenminste smaak heeft.'}
        </p>
        <button type="button" className="btn btn--primary" onClick={onSwitchPlayer}>
          Wissel naar {other}
        </button>
      </section>

      <section className="settings__card">
        <h3>Online opslag</h3>
        {mode === 'firebase' ? (
          <p className="settings__status settings__status--ok">
            ✅ Verbonden met Firebase. Floor en Tom zien dezelfde data, realtime.
          </p>
        ) : (
          <>
            <p className="settings__status settings__status--demo">
              ⚠️ Demo-modus: Firebase is nog niet ingesteld. Data wordt alleen in deze
              browser bewaard (localStorage). Floor en Tom zien elkaars landen pas als je
              Firebase koppelt — zie de README.
            </p>
            <button type="button" className="btn btn--ghost" onClick={onResetMock}>
              Demo-data resetten
            </button>
          </>
        )}
      </section>

      <section className="settings__card">
        <h3>Over deze app</h3>
        <p>
          Een speelse reis-race tussen Floor en Tom. Vink landen af, claim territorium en
          strijd om gedeelde landen via de landenbattle. Lichtroze tegen blauw — moge de beste
          reiziger winnen.
        </p>
        <p className="settings__muted">
          Tip: deel de link met de ander zodra Firebase is ingesteld, kies elk je eigen
          speler en de score loopt automatisch bij.
        </p>
      </section>
    </div>
  )
}

