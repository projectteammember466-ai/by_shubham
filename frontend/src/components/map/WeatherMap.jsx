import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, Table, ShieldAlert, Thermometer, Droplets, Wind, Cloud, 
  Activity, Compass, Globe, Info, RefreshCw, Check
} from 'lucide-react';
import { ALL_DEMO_CITIES, getMockWeather } from '../../data/weatherData';
import { fetchNearbyLocationsWeather, fetchWeatherByCoords } from '../../services/api';
import { formatTemperature } from '../../utils/formatTemperature';
import { formatWind } from '../../utils/formatWind';
import { MapLayerSelector } from './MapLayerSelector';

// Helper component to center and zoom map smoothly when selected location changes
function MapRecenter({ center, zoom = 11 }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom, {
        animate: true,
        duration: 1.2
      });
    }
  }, [center, zoom, map]);
  return null;
}

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
  const [nearbyStations, setNearbyStations] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(false);

  // Determine lat, lon, and name for current selected city
  const cityMock = useMemo(() => {
    return ALL_DEMO_CITIES.find(
      c => c.city.toLowerCase() === selectedCity.toLowerCase() || c.name.toLowerCase() === selectedCity.toLowerCase()
    ) || ALL_DEMO_CITIES[0];
  }, [selectedCity]);

  const mapCenter = useMemo(() => {
    if (geoCoords && geoCoords.latitude && geoCoords.longitude && selectedCity === 'jodhpur') {
      return [geoCoords.latitude, geoCoords.longitude];
    }
    return [cityMock.lat, cityMock.lon];
  }, [cityMock, geoCoords, selectedCity]);

  // Load live nearby station telemetry whenever selected location changes
  useEffect(() => {
    let isMounted = true;
    async function loadNearby() {
      setLoadingNearby(true);
      try {
        const stations = await fetchNearbyLocationsWeather(cityMock.lat, cityMock.lon, cityMock.name);
        if (isMounted) {
          setNearbyStations(stations);
        }
      } catch (err) {
        console.warn("Could not load nearby stations:", err);
      } finally {
        if (isMounted) setLoadingNearby(false);
      }
    }
    loadNearby();
    return () => { isMounted = false; };
  }, [cityMock.lat, cityMock.lon, cityMock.name]);

  // Helper to generate dynamic divIcon HTML for Leaflet markers based on active layer
  const createMarkerIcon = (stationName, stationData, isSelected) => {
    let layerValue = formatTemperature(stationData.temp || cityMock.temp, tempUnit);
    
    if (activeLayer === 'rain') {
      layerValue = `${stationData.rainProbability || 10}% Rain`;
    } else if (activeLayer === 'wind') {
      layerValue = formatWind(stationData.windSpeed || 12, windUnit, stationData.windDirection || 'NW');
    } else if (activeLayer === 'clouds') {
      layerValue = `${stationData.cloudCover || 20}% Cloud`;
    } else if (activeLayer === 'aqi') {
      layerValue = `AQI ${stationData.aqi || 80}`;
    } else if (activeLayer === 'alerts') {
      layerValue = stationData.hasAlert ? 'ALERT' : 'Normal';
    }

    const htmlContent = `
      <div class="map-marker-pin ${isSelected ? 'map-marker-selected' : 'map-marker-nearby'}">
        <span style="font-weight: 700;">${stationName}</span>
        <strong style="margin-left: 2px;">${layerValue}</strong>
      </div>
    `;

    return L.divIcon({
      className: 'leaflet-custom-icon',
      html: htmlContent,
      iconSize: [130, 36],
      iconAnchor: [65, 18]
    });
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      {/* Map Header & Accessibility Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            padding: '0.45rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-glow)',
            color: 'var(--accent-blue)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <MapPin size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 850, letterSpacing: '-0.01em' }}>
              Real Geospatial Weather Map & Radar
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              OpenStreetMap Basemap • Open-Meteo Telemetry • Click pins or chips to sync
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowAccessibleList(!showAccessibleList)}
          className="btn-secondary"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
          aria-label={showAccessibleList ? "Switch to interactive map view" : "Switch to accessible location list table"}
        >
          <Table size={15} />
          <span>{showAccessibleList ? 'View Interactive Map' : 'Accessible Location List'}</span>
        </button>
      </div>

      {/* Layer Selector Bar */}
      <div style={{ marginBottom: '1rem' }}>
        <MapLayerSelector activeLayer={activeLayer} onSelectLayer={onSelectLayer} t={t} />
      </div>

      {showAccessibleList ? (
        /* Accessible Table List View (Accessibility Requirement #19) */
        <div style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
          <table 
            style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}
            aria-label="Accessible Weather Stations & Cities List"
          >
            <thead>
              <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>Location Name</th>
                <th style={{ padding: '0.65rem', textAlign: 'right' }}>Coordinates</th>
                <th style={{ padding: '0.65rem', textAlign: 'right' }}>Temperature</th>
                <th style={{ padding: '0.65rem', textAlign: 'right' }}>Condition</th>
                <th style={{ padding: '0.65rem', textAlign: 'right' }}>Rain Chance</th>
                <th style={{ padding: '0.65rem', textAlign: 'right' }}>AQI</th>
                <th style={{ padding: '0.65rem', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {nearbyStations.map((station) => {
                const isSelected = station.city.toLowerCase() === selectedCity.toLowerCase() || station.isCenter;
                return (
                  <tr 
                    key={station.id} 
                    style={{ 
                      borderBottom: '1px solid var(--surface-border)',
                      background: isSelected ? 'var(--accent-glow)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '0.65rem', fontWeight: 750, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={15} style={{ color: isSelected ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
                      <span>{station.name}</span>
                      {isSelected && <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>Selected</span>}
                    </td>
                    <td style={{ padding: '0.65rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {station.lat.toFixed(2)}°, {station.lon.toFixed(2)}°
                    </td>
                    <td style={{ padding: '0.65rem', textAlign: 'right', fontWeight: 750 }}>
                      {formatTemperature(station.temp, tempUnit)}
                    </td>
                    <td style={{ padding: '0.65rem', textAlign: 'right', color: 'var(--text-secondary)' }}>
                      {station.condition}
                    </td>
                    <td style={{ padding: '0.65rem', textAlign: 'right', color: '#38bdf8', fontWeight: 600 }}>
                      {station.rainProbability}%
                    </td>
                    <td style={{ padding: '0.65rem', textAlign: 'right', color: station.aqi > 100 ? '#facc15' : '#10b981', fontWeight: 600 }}>
                      {station.aqi}
                    </td>
                    <td style={{ padding: '0.65rem', textAlign: 'center' }}>
                      <button
                        onClick={() => onSelectCity(station.name)}
                        className="btn-secondary"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
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
        /* Real Leaflet OpenStreetMap Container Canvas */
        <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <MapContainer
            center={mapCenter}
            zoom={11}
            scrollWheelZoom={true}
            className="leaflet-weather-container"
          >
            {/* Smooth Camera Auto-Recenter Controller */}
            <MapRecenter center={mapCenter} zoom={11} />

            {/* OpenStreetMap Real Tile Layer */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Selected Primary Location Leaflet Marker */}
            <Marker
              position={mapCenter}
              icon={createMarkerIcon(cityMock.name, {
                temp: cityMock.temp,
                rainProbability: cityMock.rainProbability,
                windSpeed: cityMock.windSpeed,
                windDirection: cityMock.windDirection,
                cloudCover: cityMock.cloudCover,
                aqi: cityMock.aqi,
                hasAlert: cityMock.hasAlert
              }, true)}
              evented={true}
            >
              <Popup>
                <div style={{ padding: '0.4rem', color: 'var(--text-primary)', minWidth: '180px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                    <MapPin size={15} style={{ color: 'var(--accent-blue)' }} />
                    <strong style={{ fontSize: '0.95rem' }}>{cityMock.name}</strong>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    {formatTemperature(cityMock.temp, tempUnit)} • {cityMock.condition}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                    <div>Rain: <span style={{ color: '#38bdf8' }}>{cityMock.rainProbability}%</span></div>
                    <div>Wind: <span>{formatWind(cityMock.windSpeed, windUnit)}</span></div>
                    <div>Humidity: <span>{cityMock.humidity}%</span></div>
                    <div>AQI: <span style={{ color: '#10b981' }}>{cityMock.aqi || 80}</span></div>
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Nearby Regional Weather Stations Markers */}
            {nearbyStations.filter(s => !s.isCenter).map((station) => {
              const isSelected = station.city.toLowerCase() === selectedCity.toLowerCase();
              return (
                <Marker
                  key={station.id}
                  position={[station.lat, station.lon]}
                  icon={createMarkerIcon(station.name, station, isSelected)}
                  eventHandlers={{
                    click: () => {
                      onSelectCity(station.name);
                    }
                  }}
                >
                  <Popup>
                    <div style={{ padding: '0.4rem', color: 'var(--text-primary)', minWidth: '160px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{station.name}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {formatTemperature(station.temp, tempUnit)} • {station.condition}
                      </div>
                      <button
                        onClick={() => onSelectCity(station.name)}
                        className="btn-primary"
                        style={{ marginTop: '0.5rem', width: '100%', padding: '0.3rem', fontSize: '0.75rem' }}
                      >
                        Set as Dashboard Location
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Floating Live Telemetry Overlay Card */}
          <div style={{
            position: 'absolute',
            bottom: '14px',
            left: '14px',
            zIndex: 400,
            background: 'rgba(11, 15, 25, 0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--accent-blue)',
              boxShadow: '0 0 10px var(--accent-blue)'
            }} />
            <div style={{ fontSize: '0.82rem', color: '#f8fafc' }}>
              <strong>Map Focus:</strong> {cityMock.name} ({cityMock.country || 'India'})
              <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                {formatTemperature(cityMock.temp, tempUnit)} • {cityMock.condition} • Humidity {cityMock.humidity}% • AQI {cityMock.aqi || 85}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Nearby Quick Station Chips (Requirement #11 & #18) */}
      <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--surface-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 750, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Nearby Regional Stations & Telemetry ({nearbyStations.length})
          </span>
          {loadingNearby && (
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <RefreshCw size={10} className="animate-spin" /> Updating station feeds...
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {nearbyStations.map((st) => {
            const isSelected = st.city.toLowerCase() === selectedCity.toLowerCase() || (st.isCenter && selectedCity.toLowerCase() === cityMock.city.toLowerCase());
            return (
              <button
                key={st.id}
                onClick={() => onSelectCity(st.name)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 750 : 500,
                  background: isSelected ? 'var(--accent-glow)' : 'var(--surface-color)',
                  border: isSelected ? '1px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                  color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <MapPin size={12} style={{ color: isSelected ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
                <span>{st.name}</span>
                <span style={{ fontWeight: 700 }}>{formatTemperature(st.temp, tempUnit)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

