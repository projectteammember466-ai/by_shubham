import React from 'react';
import { Navigation, Loader2 } from 'lucide-react';

export function LocationButton({ onRequestLocation, geoState }) {
  const isRequesting = geoState?.status === 'requesting';

  return (
    <button
      onClick={onRequestLocation}
      disabled={isRequesting}
      className="btn-secondary"
      title="Use my location"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.625rem 1rem',
        whiteSpace: 'nowrap'
      }}
    >
      {isRequesting ? (
        <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent-blue)' }} />
      ) : (
        <Navigation size={16} style={{ color: 'var(--accent-blue)' }} />
      )}
      <span>{isRequesting ? 'Detecting...' : 'Use My Location'}</span>
    </button>
  );
}
