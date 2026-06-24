import { useState, useRef } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { geoCentroid } from 'd3-geo'
import topology from 'world-atlas/countries-110m.json'
import { COLORS } from '../utils/constants'
import { getCountryStatus } from '../utils/countryStatus'

const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

function codeOf(geo) {
  return geo.id != null ? String(geo.id) : String(geo.properties?.name || '')
}

// De grote interactieve wereldkaart. Klikbaar, inkleurbaar, met tooltip.
export default function WorldMap({ visited, battles, onSelect }) {
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 })
  const [hoverName, setHoverName] = useState('')
  const tipRef = useRef(null)

  const handleMove = (e) => {
    const t = tipRef.current
    if (t) {
      t.style.left = `${e.clientX}px`
      t.style.top = `${e.clientY}px`
    }
  }

  const fillFor = (code) => {
    const { status } = getCountryStatus(code, visited)
    if (status === 'floor') return COLORS.floor
    if (status === 'tom') return COLORS.tom
    if (status === 'both') return 'url(#bothPattern)'
    return COLORS.neutral
  }

  const zoomBy = (factor) =>
    setPosition((p) => ({ ...p, zoom: clamp(p.zoom * factor, 1, 8) }))

  return (
    <div className="map-wrap">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 165 }}
        className="map-svg"
      >
        <defs>
          {/* Gestreepte vulling voor landen die Floor én Tom bezochten */}
          <pattern
            id="bothPattern"
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(45)"
          >
            <rect width="8" height="8" fill={COLORS.floor} />
            <rect width="4" height="8" fill={COLORS.tom} />
          </pattern>
        </defs>

        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={setPosition}
          minZoom={1}
          maxZoom={8}
        >
          <Geographies geography={topology}>
            {({ geographies }) => (
              <>
                {geographies.map((geo) => {
                  const code = codeOf(geo)
                  const name = geo.properties?.name || code
                  const battle = battles[code]
                  const won = battle && (battle.winner === 'Floor' || battle.winner === 'Tom')
                  const fill = fillFor(code)
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHoverName(name)}
                      onMouseMove={handleMove}
                      onMouseLeave={() => setHoverName('')}
                      onClick={() => onSelect(code, name)}
                      style={{
                        default: {
                          fill,
                          stroke: won ? COLORS.won : '#ffffff',
                          strokeWidth: won ? 1.1 : 0.4,
                          outline: 'none',
                        },
                        hover: {
                          fill,
                          stroke: won ? COLORS.won : '#ffffff',
                          strokeWidth: won ? 1.3 : 0.9,
                          outline: 'none',
                          cursor: 'pointer',
                          filter: 'brightness(0.92)',
                        },
                        pressed: { fill, outline: 'none' },
                      }}
                    />
                  )
                })}

                {/* Kroontje op landen die via een battle gewonnen zijn */}
                {geographies.map((geo) => {
                  const code = codeOf(geo)
                  const battle = battles[code]
                  if (!battle || (battle.winner !== 'Floor' && battle.winner !== 'Tom')) return null
                  const centroid = geoCentroid(geo)
                  if (!centroid || Number.isNaN(centroid[0])) return null
                  return (
                    <Marker key={`won-${geo.rsmKey}`} coordinates={centroid}>
                      <text textAnchor="middle" y={4} className="map-crown">
                        👑
                      </text>
                    </Marker>
                  )
                })}
              </>
            )}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip volgt de muis (zonder re-render via DOM-ref) */}
      <div
        ref={tipRef}
        className={`map-tooltip ${hoverName ? 'is-visible' : ''}`}
        role="status"
      >
        {hoverName}
      </div>

      {/* Zoomknoppen */}
      <div className="map-controls">
        <button type="button" aria-label="Inzoomen" onClick={() => zoomBy(1.5)}>
          +
        </button>
        <button type="button" aria-label="Uitzoomen" onClick={() => zoomBy(1 / 1.5)}>
          −
        </button>
        <button
          type="button"
          aria-label="Resetten"
          onClick={() => setPosition({ coordinates: [0, 20], zoom: 1 })}
        >
          ⟳
        </button>
      </div>

      {/* Legenda + inside joke */}
      <div className="map-legend">
        <div className="legend-row">
          <span className="swatch swatch--floor" /> Roze gebied = Floor-territorium
        </div>
        <div className="legend-row">
          <span className="swatch swatch--tom" /> Blauw gebied = Tom-territorium
        </div>
        <div className="legend-row">
          <span className="swatch swatch--both" /> Gestreept = allebei geweest
        </div>
        <div className="legend-row">
          <span className="swatch swatch--won">👑</span> Gewonnen via de battle
        </div>
      </div>
    </div>
  )
}

