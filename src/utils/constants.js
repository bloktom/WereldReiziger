// Vaste spelers en kleuren voor de hele app.
// Floor speelt in beige (de officiële kleur van haar twijfelachtige muur),
// Tom speelt in blauw (omdat iemand hier tenminste smaak heeft).

export const PLAYERS = {
  FLOOR: 'Floor',
  TOM: 'Tom',
}

export const COLORS = {
  floor: '#cdba8f', // beige — ja, die muurkleur
  floorDark: '#b39d6c',
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
}

export const VIEWS = {
  MAP: 'map',
  SCOREBOARD: 'scoreboard',
  BATTLES: 'battles',
  MEMORIES: 'memories',
  SETTINGS: 'settings',
}

