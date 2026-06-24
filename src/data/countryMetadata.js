// Metadata bij landen. We gebruiken de numerieke ISO 3166-1 code (zoals die in
// de world-atlas dataset zit, bv. "528" voor Nederland) als stabiele sleutel.

// Landlocked (geen kustlijn) — numerieke ISO-codes. Alles wat hier NIET in staat
// behandelen we als "aan zee", zodat de windsurf-grap van Floor kan triggeren.
const LANDLOCKED_CODES = new Set([
  '20', // Andorra
  '4', // Afghanistan
  '51', // Armenië
  '40', // Oostenrijk
  '31', // Azerbeidzjan (Kaspische Zee = meer)
  '112', // Belarus
  '64', // Bhutan
  '68', // Bolivia
  '72', // Botswana
  '854', // Burkina Faso
  '108', // Burundi
  '140', // Centraal-Afrikaanse Republiek
  '148', // Tsjaad
  '203', // Tsjechië
  '748', // Eswatini
  '231', // Ethiopië
  '348', // Hongarije
  '398', // Kazachstan
  '417', // Kirgizië
  '418', // Laos
  '426', // Lesotho
  '438', // Liechtenstein
  '442', // Luxemburg
  '454', // Malawi
  '466', // Mali
  '498', // Moldavië
  '496', // Mongolië
  '524', // Nepal
  '562', // Niger
  '807', // Noord-Macedonië
  '600', // Paraguay
  '646', // Rwanda
  '674', // San Marino
  '688', // Servië
  '703', // Slowakije
  '728', // Zuid-Soedan
  '756', // Zwitserland
  '762', // Tadzjikistan
  '795', // Turkmenistan
  '800', // Oeganda
  '860', // Oezbekistan
  '336', // Vaticaanstad
  '894', // Zambia
  '716', // Zimbabwe
])

// Landen aan zee? -> alles wat een geldige code heeft en niet landlocked is.
export function isCoastal(code) {
  const c = String(code)
  if (!c || c === '-99' || c === 'undefined') return false
  // "040" -> "40": voorloopnullen weg zodat de landlocked-lijst klopt.
  const n = Number.isNaN(Number(c)) ? c : String(Number(c))
  return !LANDLOCKED_CODES.has(n)
}

// Numerieke ISO-code -> alpha-2 code (voor vlag-emoji). Niet uitputtend, maar
// dekt zeker de gevraagde landen + veel populaire bestemmingen.
const NUM_TO_ALPHA2 = {
  '528': 'NL', '56': 'BE', '276': 'DE', '250': 'FR', '724': 'ES', '620': 'PT',
  '380': 'IT', '40': 'AT', '756': 'CH', '826': 'GB', '840': 'US', '124': 'CA',
  '484': 'MX', '504': 'MA', '818': 'EG', '792': 'TR', '300': 'GR', '360': 'ID',
  '764': 'TH', '392': 'JP', '36': 'AU', '372': 'IE', '352': 'IS', '578': 'NO',
  '752': 'SE', '208': 'DK', '246': 'FI', '616': 'PL', '203': 'CZ', '348': 'HU',
  '642': 'RO', '100': 'BG', '191': 'HR', '705': 'SI', '196': 'CY', '470': 'MT',
  '643': 'RU', '804': 'UA', '156': 'CN', '356': 'IN', '76': 'BR', '32': 'AR',
  '152': 'CL', '604': 'PE', '170': 'CO', '218': 'EC', '858': 'UY', '600': 'PY',
  '68': 'BO', '862': 'VE', '188': 'CR', '591': 'PA', '320': 'GT', '222': 'SV',
  '340': 'HN', '558': 'NI', '192': 'CU', '214': 'DO', '388': 'JM', '710': 'ZA',
  '404': 'KE', '834': 'TZ', '231': 'ET', '566': 'NG', '288': 'GH', '686': 'SN',
  '12': 'DZ', '788': 'TN', '434': 'LY', '784': 'AE', '682': 'SA', '634': 'QA',
  '512': 'OM', '414': 'KW', '376': 'IL', '400': 'JO', '422': 'LB', '364': 'IR',
  '368': 'IQ', '586': 'PK', '50': 'BD', '144': 'LK', '524': 'NP', '104': 'MM',
  '116': 'KH', '704': 'VN', '418': 'LA', '458': 'MY', '702': 'SG', '608': 'PH',
  '410': 'KR', '496': 'MN', '554': 'NZ', '242': 'FJ', '887': 'YE', '51': 'AM',
  '268': 'GE', '31': 'AZ', '398': 'KZ', '860': 'UZ', '4': 'AF', '24': 'AO',
  '516': 'NA', '72': 'BW', '894': 'ZM', '716': 'ZW', '508': 'MZ', '450': 'MG',
  '40': 'AT', '442': 'LU', '438': 'LI', '20': 'AD', '492': 'MC', '688': 'RS',
  '70': 'BA', '8': 'AL', '499': 'ME', '807': 'MK', '233': 'EE', '428': 'LV',
  '440': 'LT', '112': 'BY', '498': 'MD', '203': 'CZ', '703': 'SK', '756': 'CH',
}

// Vlag-emoji uit een alpha-2 code (regional indicator symbols).
export function flagEmoji(code) {
  // Number() haalt voorloopnullen weg ("036" -> "36") zodat de lookup klopt.
  const key = Number.isNaN(Number(code)) ? String(code) : String(Number(code))
  const a2 = NUM_TO_ALPHA2[key]
  if (!a2) return '🌍'
  return a2
    .toUpperCase()
    .replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)))
}

// De landen die de opdracht expliciet goed wil laten werken (handig voor tests).
export const FEATURED_COUNTRIES = [
  { code: '528', name: 'Nederland' },
  { code: '56', name: 'België' },
  { code: '276', name: 'Duitsland' },
  { code: '250', name: 'Frankrijk' },
  { code: '724', name: 'Spanje' },
  { code: '620', name: 'Portugal' },
  { code: '380', name: 'Italië' },
  { code: '40', name: 'Oostenrijk' },
  { code: '756', name: 'Zwitserland' },
  { code: '826', name: 'Verenigd Koninkrijk' },
  { code: '840', name: 'Verenigde Staten' },
  { code: '124', name: 'Canada' },
  { code: '484', name: 'Mexico' },
  { code: '504', name: 'Marokko' },
  { code: '818', name: 'Egypte' },
  { code: '792', name: 'Turkije' },
  { code: '300', name: 'Griekenland' },
  { code: '360', name: 'Indonesië' },
  { code: '764', name: 'Thailand' },
  { code: '392', name: 'Japan' },
  { code: '36', name: 'Australië' },
]

