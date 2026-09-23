import React, { useState } from 'react';
import { 
  Compass, Check, Sparkles, ChevronDown, ChevronUp, User, Sprout, 
  Plane, Sun, AlertTriangle, Car, CalendarCheck, Activity, Info 
} from 'lucide-react';
import { ChatBox } from '../components/chat/ChatBox';
import { CONTEXT_MODES, getContextMode } from '../data/contextModes';

// Icon mapping for 8 modes
const MODE_ICONS = {
  general: User,
  farmer: Sprout,
  traveler: Plane,
  outdoor: Sun,
  emergency: AlertTriangle,
  commuter: Car,
  event_planner: CalendarCheck,
  fitness: Activity
};

export function Chat({ 
  weather, 
  initialQuery, 
  lang = 'en', 
  setLang, 
  userMode = 'general', 
  setUserMode, 
  t = (k, f) => f || k 
}) {
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <div className="page-fade-in" style={{ padding: '0.25rem 0' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr minmax(280px, 320px)',
        gap: '1.25rem',
        alignItems: 'start'
      }} className="chat-perspective-grid">
        {/* Main WeatherGPT AI Assistant Chat */}
        <div style={{ minWidth: 0 }}>
          <ChatBox
            weatherData={weather}
            initialMessage={initialQuery}
            lang={lang}
            setLang={setLang}
            userMode={userMode}
            setUserMode={setUserMode}
            t={t}
          />
        </div>

        {/* Right-Side Weather Perspective Selector Panel */}
        <div className="glass-card" style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          borderRadius: 'var(--radius-lg)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '0.65rem',
            borderBottom: '1px solid var(--surface-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <div style={{
                padding: '0.35rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--accent-indigo)',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Compass size={17} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                  {t('weatherPerspective', 'Weather Perspective')}
                </h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {t('tailorAIAdvice', 'Tailor AI advice to your activity')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setPanelOpen(!panelOpen)}
              aria-label="Toggle perspective panel"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            >
              {panelOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* List of 8 Modes */}
          {panelOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {CONTEXT_MODES.map((mode) => {
                const isSelected = userMode === mode.id;
                const IconComponent = MODE_ICONS[mode.id] || User;
                const modeName = mode.names[lang] || mode.names.en;
                const modeDesc = mode.descriptions[lang] || mode.descriptions.en;

                return (
                  <button
                    key={mode.id}
                    onClick={() => setUserMode && setUserMode(mode.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.65rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--accent-glow)' : 'var(--surface-color)',
                      border: isSelected ? '1.5px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{
                      padding: '0.35rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'var(--accent-blue)' : 'var(--surface-card)',
                      color: isSelected ? '#fff' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      flexShrink: 0,
                      marginTop: '0.1rem'
                    }}>
                      <IconComponent size={14} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem' }}>
                        <span style={{
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 800 : 650,
                          color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)'
                        }}>
                          {modeName}
                        </span>
                        {isSelected && (
                          <Check size={14} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
                        )}
                      </div>
                      <p style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        margin: '0.15rem 0 0 0',
                        lineHeight: 1.3
                      }}>
                        {modeDesc}
                      </p>
                    </div>
                  </button>
                );
              })}

              <div style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                background: 'var(--surface-color)',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                marginTop: '0.25rem'
              }}>
                <Info size={13} style={{ flexShrink: 0, color: 'var(--accent-blue)' }} />
                <span>{t('modeSyncNote', 'Perspective syncs with Dashboard and Settings.')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
