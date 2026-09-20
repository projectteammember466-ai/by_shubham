import React from 'react';
import { AlertCard } from './AlertCard';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export function AlertDetails({ alerts = [], city = "" }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="glass-card" style={{
        padding: '2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        margin: '1rem 0'
      }}>
        <CheckCircle2 size={36} style={{ color: '#10b981' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Active Weather Alerts</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '420px' }}>
          There are currently no official weather warnings or alerts for {city || 'this location'}.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <ShieldAlert size={20} style={{ color: '#ef4444' }} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
          Active Weather Alerts ({alerts.length})
        </h2>
      </div>
      {alerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  );
}
