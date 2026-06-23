// Simpel maar leuk puntensysteem voor de landenbattle.
// Beide spelers vullen antwoorden in; wie de meeste punten haalt wint het land.

export function computeBattleScore(a) {
  if (!a) return 0
  let s = 0
  s += Math.min(Number(a.duration) || 0, 14) // langer verblijf = meer punten (max 14)
  s += Math.min(Number(a.places) || 0, 10) * 2 // meer plekken bezocht (max 20)
  if (a.localFood) s += 5 // lokaal eten geprobeerd
  if (a.culture) s += 5 // cultureel bezoek
  if (a.adventure) s += 5 // iets avontuurlijks gedaan
  s += Math.max(0, Math.min(Number(a.rating) || 0, 10)) // ervaring-score 1..10
  if (a.story && String(a.story).trim().length > 0) s += 3 // bonus voor een bijzonder verhaal
  return s
}

// Bepaal de winnaar. Geeft 'Floor', 'Tom', 'Tie' of null (nog niet compleet).
export function determineWinner(floorScore, tomScore) {
  if (floorScore == null || tomScore == null) return null
  if (floorScore > tomScore) return 'Floor'
  if (tomScore > floorScore) return 'Tom'
  return 'Tie'
}

