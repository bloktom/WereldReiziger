// Datums kunnen uit Firestore (Timestamp met .toDate()) of uit mock-mode
// (ISO-string) komen. Deze helper gaat met allebei netjes om.
export function formatDate(value) {
  if (!value) return ''
  try {
    const d = value.toDate ? value.toDate() : new Date(value)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleDateString('nl-NL', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

// Zet (Firebase-)fouten om naar een begrijpelijke melding voor de gebruiker.
export function humanizeError(e) {
  const msg = e && e.message ? e.message : String(e || 'Onbekende fout')
  if (/permission|insufficient|PERMISSION_DENIED/i.test(msg)) {
    return 'Opslaan geweigerd: geen schrijfrechten in Firestore. Zet de Firestore-regels open (read/write). Zie de README.'
  }
  if (/unavailable|network|offline|Failed to get document/i.test(msg)) {
    return 'Geen verbinding met de database. Controleer je internet en probeer opnieuw.'
  }
  return 'Opslaan mislukt: ' + msg
}

