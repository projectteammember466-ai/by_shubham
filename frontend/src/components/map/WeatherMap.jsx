import React, { useState } from 'react';
import { MapPin, Navigation, Layers, ShieldAlert, Thermometer, Droplets, Wind, Cloud, Activity, Table, Check } from 'lucide-react';
import { ALL_DEMO_CITIES } from '../../data/weatherData';
import { formatTemperature } from '../../utils/formatTemperature';
import { formatWind } from '../../utils/formatWind';
import { MapLayerSelector } from './MapLayerSelector';

export function WeatherMap({
  selectedCity = 'jodhpur',
  onSelectCity,
  activeLayer = 'temperature',
  onSelectLayer,
  geoCoords,
  tempUnit = 'C',
  windUnit = 'kmh',
  t = (k) => k
}) {
  const [showAccessibleList, setShowAccessibleList] = useState(false);
  const [hoveredCity, setHoveredCity] = useState(null);

  // SVG coordinate transformation for geographic bounds (Equirectangular projection)
  // Latitude: -60 to 70 -> Y: 360 to 40
  // Longitude: -100 to 150 -> X: 50 to 750
  const mapWidth = 800;
  const mapHeight = 440;

  const projectCoords = (lat, lon) => {
    // Normalizing between longitude -120 to +150
    const x = ((lon + 120) / 270) * (mapWidth - 100) + 50;
    // Normalizing between latitude -40 to +70
    const y = ((70 - lat) / 110) * (mapHeight - 80) + 40;
    return {
      x: Math.max(40, Math.min(mapWidth - 40, x)),
      y: Math.max(30, Math.min(mapHeight - 30, y))
    };
  };

  const currentSelectedCityData = ALL_DEMO_CITIES.find(
    c => c.city.toLowerCase() === selectedCity.toLowerCase()
  ) || ALL_DEMO_CITIES[0];

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      {/* Map Header & Layer Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            padding: '0.4rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-glow)',
            color: 'var(--accent-blue)'
          }}>
            <MapPin size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 850 }}>Location-Aware Weather Map</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Interactive Geospatial Weather Telemetry • Click any pin to sync dashboard
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowAccessibleList(!showAccessibleList)}
          className="btn-secondary"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
          aria-label={showAccessibleList ? "Switch to interactive map" : "Switch to accessible table list"}
        >
          <Table size={14} />
          <span>{showAccessibleList ? 'View Interactive Map' : 'Accessible Location List'}</span>
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <MapLayerSelector activeLayer={activeLayer} onSelectLayer={onSelectLayer} t={t} />
      </div>

      {showAccessibleList ? (
        /* Accessible Non-Map Location List Alternative (A18 Accessibility Requirement) */
        <div style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
          <table 
            style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}
            aria-label="Accessible Weather Stations & Cities List"
          >
            <thead>
              <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.6rem', textAlign: 'left' }}>City & Country</th>
                <th style={{ padding: '0.6rem', textAlign: 'right' }}>Coordinates</th>
                <th style={{ padding: '0.6rem', textAlign: 'right' }}>Temperature</th>
                <th style={{ padding: '0.6rem', textAlign: 'right' }}>Condition</th>
                <th style={{ padding: '0.6rem', textAlign: 'right' }}>Rain Chance</th>
                <th style={{ padding: '0.6rem', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {ALL_DEMO_CITIES.map((c) => {
                const isSelected = c.city.toLowerCase() === selectedCity.toLowerCase();
                return (
                  <tr 
                    key={c.id} 
                    style={{ 
                      borderBottom: '1px solid var(--surface-border)',
                      background: isSelected ? 'var(--accent-glow)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '0.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={14} style={{ color: isSelected ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
                      <span>{c.name}, {c.country}</span>
                      {isSelected && <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Selected</span>}
                    </td>
                    <td style={{ padding: '0.6rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {c.lat.toFixed(2)}°, {c.lon.toFixed(2)}°
                    </td>
                    <td style={{ padding: '0.6rem', textAlign: 'right', fontWeight: 700 }}>
                      {formatTemperature(c.temp, tempUnit)}
                    </td>
                    <td style={{ padding: '0.6rem', textAlign: 'right', color: 'var(--text-secondary)' }}>
                      {c.condition}
                    </td>
                    <td style={{ padding: '0.6rem', textAlign: 'right', color: '#38bdf8' }}>
                      {c.rainProbability}%
                    </td>
                    <td style={{ padding: '0.6rem', textAlign: 'center' }}>
                      <button
                        onClick={() => onSelectCity(c.city)}
                        className="btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        {isSelected ? 'Active' : 'Select'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Geospatial Interactive Map Graphic Canvas */
        <div style={{
          position: 'relative',
          width: '100%',
          overflowX: 'auto',
          background: 'radial-gradient(ellipse at 50% 50%, #0f172a 0%, #060913 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--surface-border)',
          boxShadow: 'inset 0 0 25px rgba(0,0,0,0.5)'
        }}>
          <svg
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            style={{ width: '100%', minWidth: '600px', height: 'auto', display: 'block' }}
            role="region"
            aria-label="Interactive world and regional weather map"
          >
            {/* Latitude and Longitude Reference Grid */}
            <defs>
              <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapGrid)" />

            {/* Stylized Continental Landmass Outlines (Equirectangular representation) */}
            <g fill="rgba(30, 41, 59, 0.5)" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1">
              {/* Eurasia & India Subcontinent */}
              <path d="M 380 90 Q 450 80 540 100 Q 620 120 660 180 Q 580 220 540 250 L 510 290 L 490 280 L 470 240 L 410 220 L 390 160 Z" />
              <path d="M 470 230 L 510 240 L 500 295 L 485 300 L 470 260 Z" fill="rgba(56, 189, 248, 0.08)" stroke="rgba(56, 189, 248, 0.3)" />
              {/* Africa */}
              <path d="M 390 180 L 460 190 L 480 260 L 450 360 L 420 370 L 380 280 L 370 220 Z" />
              {/* Americas */}
              <path d="M 120 70 L 220 80 L 250 140 L 200 210 L 150 160 Z" />
              <path d="M 210 220 L 280 260 L 260 380 L 210 390 L 190 290 Z" />
              {/* Japan Archipelago */}
              <path d="M 670 160 Q 685 180 675 200" stroke="rgba(255,255,255,0.4)" strokeWidth="3" fill="none" />
              {/* British Isles */}
              <path d="M 370 120 Q 380 115 375 135 Z" fill="rgba(255,255,255,0.2)" />
            </g>

            {/* Simulated Cloud / Rain / Wind Layer Effects */}
            {activeLayer === 'rain' && (
              <g fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="2" strokeDasharray="3,3">
                <circle cx="500" cy="270" r="45" />
                <circle cx="485" cy="285" r="35" />
                <circle cx="375" cy="130" r="30" />
                <circle cx="210" cy="210" r="40" />
              </g>
            )}

            {activeLayer === 'clouds' && (
              <g fill="rgba(255, 255, 255, 0.08)">
                <ellipse cx="490" cy="250" rx="60" ry="25" />
                <ellipse cx="380" cy="130" rx="45" ry="20" />
                <ellipse cx="210" cy="210" rx="55" ry="30" />
              </g>
            )}

            {/* Geolocation Marker if available */}
            {geoCoords && (
              <g>
                {(() => {
                  const pos = projectCoords(geoCoords.latitude, geoCoords.longitude);
                  return (
                    <g transform={`translate(${pos.x}, ${pos.y})`}>
                      <circle r="14" fill="rgba(56, 189, 248, 0.2)" className="animate-ping" />
                      <circle r="6" fill="var(--accent-blue)" stroke="#ffffff" strokeWidth="2" />
                      <text y="-10" textAnchor="middle" fill="var(--accent-blue)" fontSize="10" fontWeight="700">
                        My Location
                      </text>
                    </g>
                  );
                })()}
              </g>
            )}

            {/* City Weather Pins */}
            {ALL_DEMO_CITIES.map((cityObj) => {
              const pos = projectCoords(cityObj.lat, cityObj.lon);
              const isSelected = cityObj.city.toLowerCase() === selectedCity.toLowerCase();
              const isHovered = hoveredCity === cityObj.city;

              // Compute layer label
              let layerText = formatTemperature(cityObj.temp, tempUnit);
              let badgeColor = '#f97316';

              if (activeLayer === 'rain') {
                layerText = `${cityObj.rainProbability}%`;
                badgeColor = '#38bdf8';
              } else if (activeLayer === 'wind') {
                layerText = formatWind(cityObj.windSpeed, windUnit);
                badgeColor = '#06b6d4';
              } else if (activeLayer === 'clouds') {
                layerText = `${cityObj.cloudCover || 30}%`;
                badgeColor = '#94a3b8';
              } else if (activeLayer === 'aqi') {
                layerText = `AQI ${cityObj.aqi || 80}`;
                badgeColor = cityObj.aqi > 150 ? '#ef4444' : cityObj.aqi > 100 ? '#facc15' : '#10b981';
              } else if (activeLayer === 'alerts') {
                layerText = cityObj.hasAlert ? 'ALERT' : 'Normal';
                badgeColor = cityObj.hasAlert ? '#ef4444' : '#10b981';
              }

              return (
                <g
                  key={cityObj.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  tabIndex={0}
                  role="button"
                  aria-label={`${cityObj.name}: ${layerText}`}
                  onClick={() => onSelectCity(cityObj.city)}
                  onMouseEnter={() => setHoveredCity(cityObj.city)}
                  onMouseLeave={() => setHoveredCity(null)}
                  onFocus={() => setHoveredCity(cityObj.city)}
                  onBlur={() => setHoveredCity(null)}
                  style={{ cursor: 'pointer', outline: 'none' }}
                >
                  {/* Glowing selection ring */}
                  {isSelected && (
                    <circle
                      r="20"
                      fill="none"
                      stroke="var(--accent-blue)"
                      strokeWidth="2"
                      opacity="0.75"
                      strokeDasharray="4,2"
                    />
                  )}

                  {/* Pin Dot */}
                  <circle
                    r={isSelected ? "7" : "5"}
                    fill={isSelected ? "var(--accent-blue)" : badgeColor}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? "2.5" : "1.5"}
                  />

                  {/* Dynamic Layer Data Bubble */}
                  <g transform="translate(0, -14)">
                    <rect
                      x={-layerText.length * 3.8 - 6}
                      y="-12"
                      width={layerText.length * 7.6 + 12}
                      height="17"
                      rx="8"
                      fill={isSelected ? "var(--accent-blue)" : "rgba(15, 23, 42, 0.9)"}
                      stroke={isSelected ? "#ffffff" : badgeColor}
                      strokeWidth="1.2"
                    />
                    <text
                      textAnchor="middle"
                      y="0"
                      fill={isSelected ? "#ffffff" : "var(--text-primary)"}
                      fontSize="9.5"
                      fontWeight="800"
                    >
                      {layerText}
                    </text>
                  </g>

                  {/* City Name Label */}
                  <text
                    y="18"
                    textAnchor="middle"
                    fill={isSelected ? "var(--accent-blue)" : "#f1f5f9"}
                    fontSize={isSelected ? "11.5" : "10"}
                    fontWeight={isSelected ? "800" : "600"}
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                  >
                    {cityObj.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Active Synced Location Overlay Card */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#f8fafc',
            fontSize: '0.85rem'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--accent-blue)',
              boxShadow: '0 0 8px var(--accent-blue)'
            }} />
            <div>
              <strong>Map Focus:</strong> {currentSelectedCityData.name} ({currentSelectedCityData.country})
              <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                {formatTemperature(currentSelectedCityData.temp, tempUnit)} • {currentSelectedCityData.condition}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
