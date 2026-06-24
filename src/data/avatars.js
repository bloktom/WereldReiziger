import { PLAYERS, STORAGE_KEYS } from '../utils/constants'

// Avatars staan in public/icons/<Speler>/ en worden door Vite in de build
// meegekopieerd. BASE_URL is '/' lokaal en '/WereldReiziger/' op GitHub Pages,
// dus de paden kloppen overal.
const base = import.meta.env.BASE_URL || '/'

// Bestandsnamen per speler (zoals ze in public/icons/<Speler>/ staan).
const FILES = {
  [PLAYERS.FLOOR]: ['Floor1.jpg', 'Floor2.jpg', 'Floor1.webp', 'Floor AI.png'],
  [PLAYERS.TOM]: ['Tom1.jpeg', 'Tom3.jpeg', 'Tom AI.png'],
}

function toOption(player, file) {
  return {
    id: file,
    label: file.replace(/\.[^.]+$/, ''), // naam zonder extensie
    // Spaties in bestandsnamen ("Floor AI.png") netjes encoden voor de URL.
    url: `${base}icons/${player}/${encodeURIComponent(file)}`,
  }
}

// Lijst met keuzes per speler.
export const AVATARS = {
  [PLAYERS.FLOOR]: FILES[PLAYERS.FLOOR].map((f) => toOption(PLAYERS.FLOOR, f)),
  [PLAYERS.TOM]: FILES[PLAYERS.TOM].map((f) => toOption(PLAYERS.TOM, f)),
}

// De standaard ("simpel icoon, geen foto").
export const DEFAULT_AVATAR_ID = 'default'
export const DEFAULT_AVATAR_EMOJI = '👤'

// Vind de gekozen avatar-optie (of null voor de default).
export function findAvatar(player, id) {
  if (!id || id === DEFAULT_AVATAR_ID) return null
  return (AVATARS[player] || []).find((a) => a.id === id) || null
}

// Lees de opgeslagen avatar-keuze van een speler uit localStorage.
export function loadAvatar(player) {
  try {
    return localStorage.getItem(`${STORAGE_KEYS.avatar}.${player}`) || DEFAULT_AVATAR_ID
  } catch {
    return DEFAULT_AVATAR_ID
  }
}

// Bewaar de avatar-keuze van een speler.
export function saveAvatar(player, id) {
  try {
    localStorage.setItem(`${STORAGE_KEYS.avatar}.${player}`, id)
  } catch {
    /* opslag niet beschikbaar — negeren */
  }
}

