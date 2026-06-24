// Vaste spelers en kleuren voor de hele app.
// Floor speelt in lichtroze (de officiële kleur van haar muur),
// Tom speelt in blauw (omdat iemand hier tenminste smaak heeft).

export const PLAYERS = {
  FLOOR: 'Floor',
  TOM: 'Tom',
}

export const COLORS = {
  floor: '#e891b0', // lichtroze — ja, die muurkleur
  floorDark: '#c15c85',
  tom: '#2d6cdf', // fris blauw
  tomDark: '#1f4fb0',
  neutral: '#dfe3e8',
  neutralHover: '#cdd4dd',
  won: '#f2c14e', // goud randje voor een gewonnen land
  ocean: '#d6ecf5',
}

export const STORAGE_KEYS = {
  player: 'wereldrace.player',
  visited: 'wereldrace.visited',
  battles: 'wereldrace.battles',
  seeded: 'wereldrace.seeded.v1',
  avatar: 'wereldrace.avatar', // + '.Floor' / '.Tom'
}

export const VIEWS = {
  MAP: 'map',
  SCOREBOARD: 'scoreboard',
  BATTLES: 'battles',
  MEMORIES: 'memories',
  SETTINGS: 'settings',
}

