import { PLAYERS } from '../utils/constants'

export const WELCOME_TEXT = 'Welkom bij de grote wereldrace van Floor en Tom.'

// Speelse teksten wanneer FLOOR een land aanvinkt.
const FLOOR_MESSAGES = [
  'Goed hoor Floor, jij verdient een cola\u2019tje.',
  'Goed Floor, wat heb je daar allemaal gedaan?',
  'Met welk type vliegtuig ben je geweest\u2026?',
  'Weer een land erbij. Tom voelt de druk.',
  'Floor claimt weer roze terrein.',
  'Dit land past echt perfect bij je muur.',
  'Ok\u00e9 ok\u00e9, wereldreiziger Floor.',
  'Heeft Polarsteps dit ook goedgekeurd?',
]

// Extra teksten voor landen aan zee (bij Floor).
const FLOOR_COASTAL_MESSAGES = [
  'Ben jij hiernaartoe gaan windsurfen?',
  'Lekker aan zee zeker? Tom is jaloers vanaf het droge.',
]

// Persoonlijke, land-specifieke teksten voor Floor (numerieke ISO-landcode).
// Deze hebben voorrang en verschijnen altijd bij dat specifieke land.
const FLOOR_COUNTRY_MESSAGES = {
  360: 'Back to your roots? Opa zou trots zijn.', // Indonesi\u00eb
  380: 'Volgens mij heb je Tom net gemist toen je naar Rome ging.', // Itali\u00eb
  418: 'Ben je hier aangevallen door bloedzuigers?', // Laos
  36: 'Familiebezoek?', // Australi\u00eb
  208: 'Een duur bezoekje bij de Alchemist?', // Denemarken
}

// Speelse teksten wanneer TOM een land aanvinkt.
const TOM_MESSAGES = [
  'Tom pakt eindelijk ook een landje mee.',
  'Blauw terrein uitgebreid.',
  'Niet slecht voor iemand die minder heeft gereisd.',
  'Tom komt langzaam dichterbij.',
  'Dit wordt nog spannend.',
  'Floor kijkt bezorgd naar de score.',
]

const BATTLE_MESSAGES = {
  Floor: [
    'Floor wint dit land. Roze overheerst.',
    'Floor had meer verhalen, Tom had vooral goede bedoelingen.',
  ],
  Tom: [
    'Tom wint dit land. Eindelijk gerechtigheid.',
    'Blauw verslaat roze. Smaak wint.',
  ],
  Tie: [
    'Gelijkspel. Jullie moeten hier samen nog een keer heen.',
    'Gelijkspel. Tijd om samen een nieuw land te claimen.',
  ],
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const landWord = (n) => (Math.abs(n) === 1 ? 'land' : 'landen')

// Random speelse tekst bij het aanvinken van een land.
export function getMarkMessage(player, coastal, code) {
  if (player === PLAYERS.FLOOR) {
    // Persoonlijke land-grap heeft altijd voorrang.
    const personal = FLOOR_COUNTRY_MESSAGES[String(code)]
    if (personal) return personal
    const pool = coastal ? [...FLOOR_MESSAGES, ...FLOOR_COASTAL_MESSAGES] : FLOOR_MESSAGES
    return pick(pool)
  }
  return pick(TOM_MESSAGES)
}

// Grappige tekst bij de uitslag van een landenbattle.
export function getBattleMessage(winner) {
  if (winner === 'Floor') return pick(BATTLE_MESSAGES.Floor)
  if (winner === 'Tom') return pick(BATTLE_MESSAGES.Tom)
  return pick(BATTLE_MESSAGES.Tie)
}

// Statustekst onder de scorebalk.
export function getScoreStatus(floorCount, tomCount) {
  const diff = Math.abs(floorCount - tomCount)
  if (floorCount > tomCount) {
    return pick([
      `Floor staat ${diff} ${landWord(diff)} voor. Verrassend? Nee.`,
      'Tom moet nog even een wereldburger worden.',
    ])
  }
  if (tomCount > floorCount) {
    return pick([
      `Tom staat ${diff} ${landWord(diff)} voor. Het tij keert.`,
      'Tom komt langzaam dichterbij. Floor kijkt bezorgd naar de score.',
    ])
  }
  return 'Gelijkspel. Tijd om samen een nieuw land te claimen.'
}

