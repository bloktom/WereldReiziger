import { PLAYERS } from '../utils/constants'
import { computeBattleScore, determineWinner } from '../utils/scoring'

// Demo / mock data zodat de app meteen iets laat zien zonder Firebase.
// Floor reist veel, Tom is nog wat aan het inhalen.

const now = new Date().toISOString()

function v(player, code, name, extra = {}) {
  return {
    player,
    countryCode: String(code),
    countryName: name,
    visited: true,
    note: '',
    memory: '',
    visitDate: '',
    imageUrl: '',
    createdAt: now,
    updatedAt: now,
    ...extra,
  }
}

const floorCountries = [
  ['528', 'Netherlands'],
  ['276', 'Germany'],
  ['250', 'France'],
  ['724', 'Spain'],
  ['620', 'Portugal'],
  ['380', 'Italy'],
  ['300', 'Greece'],
  ['792', 'Turkey'],
  ['504', 'Morocco'],
  ['818', 'Egypt'],
  ['360', 'Indonesia'],
  ['764', 'Thailand'],
  ['392', 'Japan'],
  ['36', 'Australia'],
  ['484', 'Mexico'],
  ['40', 'Austria'],
]

const tomCountries = [
  ['528', 'Netherlands'],
  ['56', 'Belgium'],
  ['276', 'Germany'],
  ['250', 'France'],
  ['826', 'United Kingdom'],
  ['840', 'United States'],
]

export const SEED_VISITED = {}

floorCountries.forEach(([code, name]) => {
  SEED_VISITED[`${PLAYERS.FLOOR}_${code}`] = v(PLAYERS.FLOOR, code, name)
})
tomCountries.forEach(([code, name]) => {
  SEED_VISITED[`${PLAYERS.TOM}_${code}`] = v(PLAYERS.TOM, code, name)
})

// Een paar herinneringen voor de sfeer.
SEED_VISITED[`${PLAYERS.FLOOR}_764`] = v(PLAYERS.FLOOR, '764', 'Thailand', {
  note: 'Eilandhoppen en veel te veel pad thai.',
  memory: 'Zonsondergang bij Railay Beach. Onverslaanbaar.',
  visitDate: '2023-02-12',
})
SEED_VISITED[`${PLAYERS.FLOOR}_392`] = v(PLAYERS.FLOOR, '392', 'Japan', {
  note: 'Tokio, Kyoto en een hoop ramen.',
  memory: 'Verdwaald in een hypermodern treinstation. Heerlijk.',
  visitDate: '2022-04-03',
})
SEED_VISITED[`${PLAYERS.TOM}_826`] = v(PLAYERS.TOM, '826', 'United Kingdom', {
  note: 'Weekendje Londen.',
  memory: 'Regen. Veel regen. Maar wel goede pub.',
  visitDate: '2023-11-18',
})

// Eén volledig ingevulde battle als voorbeeld (Nederland — beiden geweest).
const floorAnswersNL = {
  duration: 10,
  places: 5,
  localFood: true,
  culture: true,
  adventure: false,
  story: 'Stroopwafels vers van de markt bij de molen.',
  rating: 8,
}
const tomAnswersNL = {
  duration: 30,
  places: 3,
  localFood: true,
  culture: false,
  adventure: true,
  story: '',
  rating: 7,
}
const floorScoreNL = computeBattleScore(floorAnswersNL)
const tomScoreNL = computeBattleScore(tomAnswersNL)

export const SEED_BATTLES = {
  528: {
    countryCode: '528',
    countryName: 'Netherlands',
    floorAnswers: floorAnswersNL,
    tomAnswers: tomAnswersNL,
    floorScore: floorScoreNL,
    tomScore: tomScoreNL,
    winner: determineWinner(floorScoreNL, tomScoreNL),
    updatedAt: now,
  },
}

