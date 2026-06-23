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

