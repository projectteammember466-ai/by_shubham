import React from 'react';
import { WeatherMap } from '../components/map/WeatherMap';
import { Card } from '../components/common/Card';
import { MapPin, Navigation, Info, ArrowRight } from 'lucide-react';
import { formatTemperature } from '../utils/formatTemperature';

export function MapView({
  selectedCity,
  onSelectCity,
  activeLayer,
  onSelectLayer,
  geoState,
  weather,
  tempUnit,
  windUnit,
  onNavigateDashboard,
  t = (k) => k
}) {
  return (
    <div className="page-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <WeatherMap
        selectedCity={selectedCity}
        onSelectCity={onSelectCity}
        activeLayer={activeLayer}
        onSelectLayer={onSelectLayer}
        geoCoords={geoState?.coords}
        tempUnit={tempUnit}
        windUnit={windUnit}
        t={t}
      />

      {/* Synchronized Quick Card */}
      {weather && (
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              padding: '0.65rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-glow)',
              color: 'var(--accent-blue)'
            }}>
              <MapPin size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{weather.location.city}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({weather.location.country})</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                {formatTemperature(weather.current.temperature, tempUnit)} • {weather.current.condition} • Rain: {weather.current.rainProbability}%
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateDashboard}
            className="btn-primary"
            style={{ gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <span>View Complete Dashboard</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
