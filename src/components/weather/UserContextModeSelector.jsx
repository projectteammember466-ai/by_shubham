import React from 'react';
import { User, Sprout, Plane, Sun, AlertTriangle } from 'lucide-react';

export function UserContextModeSelector({ userMode, onSelectMode, advice, t = (k) => k }) {
  const modes = [
    { id: 'general', label: t('modeGeneral', 'General'), icon: User },
    { id: 'farmer', label: t('modeFarmer', 'Farmer'), icon: Sprout },
    { id: 'traveler', label: t('modeTraveler', 'Traveler'), icon: Plane },
    { id: 'outdoor', label: t('modeOutdoor', 'Outdoor'), icon: Sun },
    { id: 'emergency', label: t('modeEmergency', 'Emergency'), icon: AlertTriangle }
  ];

  return (
    <div style={{ margin: '1rem 0' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '0.65rem'
      }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          {t('contextModeTitle', 'Context Mode')}:
        </span>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = userMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 800 : 500,
                  background: isSelected ? 'var(--accent-glow)' : 'var(--surface-card)',
                  color: isSelected ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  border: isSelected ? '1px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={13} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Advisory Card */}
      {advice && advice[userMode] && (
        <div className="page-fade-in" style={{
          background: userMode === 'emergency' ? 'rgba(239, 68, 68, 0.1)' : 'var(--surface-color)',
          borderLeft: `4px solid ${userMode === 'emergency' ? '#ef4444' : 'var(--accent-blue)'}`,
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
          color: 'var(--text-primary)',
          lineHeight: 1.4
        }}>
          <strong>{modes.find(m => m.id === userMode)?.label} Advisory: </strong>
          {advice[userMode]}
        </div>
      )}
    </div>
  );
}
