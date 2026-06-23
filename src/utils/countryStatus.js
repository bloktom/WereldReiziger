import { PLAYERS } from './constants'

// Unieke document-id per speler + land, bv. "Floor_528".
export const visitedKey = (player, code) => `${player}_${code}`

export function isVisited(visited, player, code) {
  const doc = visited[visitedKey(player, code)]
  return !!(doc && doc.visited)
}

export function getVisitedDoc(visited, player, code) {
  return visited[visitedKey(player, code)] || null
}

// Status van één land: door niemand, Floor, Tom of allebei bezocht.
export function getCountryStatus(code, visited) {
  const floor = isVisited(visited, PLAYERS.FLOOR, code)
  const tom = isVisited(visited, PLAYERS.TOM, code)
  let status = 'none'
  if (floor && tom) status = 'both'
  else if (floor) status = 'floor'
  else if (tom) status = 'tom'
  return { floor, tom, both: floor && tom, status }
}

// Aantal bezochte landen per speler.
export function countVisited(visited, player) {
  return Object.values(visited).filter((d) => d && d.visited && d.player === player).length
}

// Alle landen die door een specifieke speler zijn bezocht.
export function visitedListForPlayer(visited, player) {
  return Object.values(visited)
    .filter((d) => d && d.visited && d.player === player)
    .sort((a, b) => (a.countryName || '').localeCompare(b.countryName || ''))
}

// Landcodes die door BEIDE spelers zijn bezocht.
export function sharedCountryCodes(visited) {
  const floorCodes = new Set()
  const tomCodes = new Set()
  Object.values(visited).forEach((d) => {
    if (!d || !d.visited) return
    if (d.player === PLAYERS.FLOOR) floorCodes.add(String(d.countryCode))
    if (d.player === PLAYERS.TOM) tomCodes.add(String(d.countryCode))
  })
  return [...floorCodes].filter((c) => tomCodes.has(c))
}

// Handige lijst van gedeelde landen met naam (voor overzichten / battles).
export function sharedCountries(visited) {
  return sharedCountryCodes(visited)
    .map((code) => {
      const doc = visited[visitedKey(PLAYERS.FLOOR, code)] || visited[visitedKey(PLAYERS.TOM, code)]
      return { code, name: doc ? doc.countryName : code }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

