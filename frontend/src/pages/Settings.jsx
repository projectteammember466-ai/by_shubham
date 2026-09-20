import React from 'react';
import { 
  Settings as SettingsIcon, Sun, Moon, Monitor, Thermometer, Wind, MapPin, 
  Check, Globe, User, Sprout, Plane, AlertTriangle, Bell, ShieldCheck, CheckSquare, Square 
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../data/translations';

export function Settings({
  theme,
  setTheme,
  tempUnit,
  setTempUnit,
  windUnit,
  setWindUnit,
  city,
  onRequestLocation,
  geoState,
  userMode,
  setUserMode,
  lang,
  setLang,
  alertPreferences,
  setAlertPreferences,
  t = (k) => k
}) {
  const themeOptions = [
    { id: 'system', label: 'System Default', icon: Monitor },
    { id: 'light', label: 'Light Mode', icon: Sun },
    { id: 'dark', label: 'Dark Mode', icon: Moon }
  ];

  const userModes = [
    { id: 'general', label: 'General', desc: 'Standard comprehensive weather view', icon: User },
    { id: 'farmer', label: 'Farmer', desc: 'Prioritizes rain volume, soil moisture, and wind', icon: Sprout },
    { id: 'traveler', label: 'Traveler', desc: 'Prioritizes visibility, road safety, and delays', icon: Plane },
    { id: 'outdoor', label: 'Outdoor', desc: 'Prioritizes UV index, AQI, and heat stress', icon: Sun },
    { id: 'emergency', label: 'Emergency', desc: 'Prioritizes active alerts and safety advisories', icon: AlertTriangle }
  ];

  const alertCategories = [
    { id: 'heavyRain', label: 'Heavy Rain & Flooding' },
    { id: 'thunderstorm', label: 'Thunderstorms & Lightning' },
    { id: 'extremeHeat', label: 'Extreme Heat & Heatwave' },
    { id: 'strongWind', label: 'High Winds & Gales' },
    { id: 'poorAQI', label: 'Hazardous Air Quality (AQI)' },
    { id: 'extremeCold', label: 'Freezing Ice & Cold Wave' }
  ];

  const isGeoRequesting = geoState?.status === 'requesting';

  const toggleAlertType = (key) => {
    setAlertPreferences(prev => ({
      ...prev,
      types: {
        ...prev.types,
        [key]: !prev.types[key]
      }
    }));
  };

  const setFrequency = (freq) => {
    setAlertPreferences(prev => ({
      ...prev,
      frequency: freq
    }));
  };

  return (
    <div className="page-fade-in" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <SettingsIcon size={26} style={{ color: 'var(--accent-blue)' }} />
        <h1 style={{ fontSize: '1.75rem', fontWeight: 850 }}>App Preferences & Settings</h1>
      </div>

      {/* Language / भाषा (A12) */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <Globe size={18} style={{ color: 'var(--accent-blue)' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 750 }}>Language / भाषा (A12)</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Choose your interface language. Supports English, Hindi, and Hinglish. Architecture ready for additional regional Indian languages.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {SUPPORTED_LANGUAGES.map((l) => {
            const isSelected = lang === l.id;
            return (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--accent-glow)' : 'var(--surface-color)',
                  border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                  fontWeight: isSelected ? 750 : 500,
                  color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)'
                }}
              >
                <div>
                  <span style={{ fontWeight: 800, display: 'block' }}>{l.native}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{l.label}</span>
                </div>
                {isSelected && <Check size={16} />}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
          Additional regional languages (Gujarati, Marathi, Tamil, Telugu, Bengali, Punjabi, Kannada, Malayalam) queued for Phase B.
        </div>
      </div>

      {/* User Context Modes (A17) */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <User size={18} style={{ color: 'var(--accent-indigo)' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 750 }}>User Context Mode (A17)</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Customizes dashboard presentation and AI advisories for your specific activity or profession.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {userModes.map((m) => {
            const Icon = m.icon;
            const isSelected = userMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setUserMode(m.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--accent-glow)' : 'var(--surface-color)',
                  border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                    <Icon size={16} />
                    <span>{m.label}</span>
                  </div>
                  {isSelected && <Check size={16} style={{ color: 'var(--accent-blue)' }} />}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {m.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Smart Alert Preferences (A20) */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <Bell size={18} style={{ color: '#ef4444' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 750 }}>Smart Alert Preferences (A20)</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Customize which weather warnings matter to you and notification urgency (Frontend demo preferences).
        </p>

        {/* Alert Type Checkboxes */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
            Active Categories:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
            {alertCategories.map((cat) => {
              const isChecked = alertPreferences?.types?.[cat.id] ?? true;
              return (
                <div
                  key={cat.id}
                  onClick={() => toggleAlertType(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-color)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    color: isChecked ? 'var(--text-primary)' : 'var(--text-muted)'
                  }}
                >
                  {isChecked ? (
                    <CheckSquare size={16} style={{ color: 'var(--accent-blue)' }} />
                  ) : (
                    <Square size={16} style={{ color: 'var(--text-muted)' }} />
                  )}
                  <span>{cat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Frequency Choice */}
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
            Notification Frequency:
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'immediate', label: 'Immediately' },
              { id: 'important', label: 'Important Only' },
              { id: 'daily', label: 'Daily Digest' }
            ].map((f) => {
              const isSelected = alertPreferences?.frequency === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFrequency(f.id)}
                  className={isSelected ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 750, marginBottom: '0.5rem' }}>
          Theme & Visual Atmosphere
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Choose your preferred color theme or match your operating system.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--accent-glow)' : 'var(--surface-color)',
                  border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                  fontWeight: isSelected ? 750 : 500,
                  color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Icon size={18} />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check size={16} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Units Settings */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 750, marginBottom: '0.5rem' }}>
          Units of Measurement
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Configure display units for temperature and wind velocity.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Temperature Unit */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Thermometer size={18} style={{ color: 'var(--accent-blue)' }} />
              <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>Temperature Unit</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setTempUnit('C')}
                className={tempUnit === 'C' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              >
                Celsius (°C)
              </button>
              <button
                onClick={() => setTempUnit('F')}
                className={tempUnit === 'F' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          {/* Wind Unit */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--surface-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wind size={18} style={{ color: 'var(--accent-cyan)' }} />
              <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>Wind Speed Unit</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setWindUnit('kmh')}
                className={windUnit === 'kmh' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              >
                km/h (Default)
              </button>
              <button
                onClick={() => setWindUnit('mph')}
                className={windUnit === 'mph' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              >
                mph
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Location Configuration */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 750, marginBottom: '0.5rem' }}>
          Location Configuration
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Active station: <strong>{city ? city.charAt(0).toUpperCase() + city.slice(1) : 'Not set'}</strong>
        </p>

        <button 
          onClick={onRequestLocation} 
          disabled={isGeoRequesting}
          className="btn-secondary" 
          style={{ gap: '0.5rem' }}
        >
          <MapPin size={16} style={{ color: 'var(--accent-blue)' }} />
          <span>{isGeoRequesting ? 'Detecting coordinates...' : 'Update via Browser Geolocation'}</span>
        </button>

        {geoState?.message && (
          <p style={{
            fontSize: '0.82rem',
            marginTop: '0.75rem',
            color: geoState.status === 'denied' || geoState.status === 'error' ? '#ef4444' : 'var(--accent-blue)',
            fontWeight: 600
          }}>
            {geoState.message}
          </p>
        )}
      </div>
    </div>
  );
}
