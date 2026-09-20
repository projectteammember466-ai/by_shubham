import React from 'react';
import { Search } from 'lucide-react';

export function EmptyState({ title = "No Results Found", description = "Try searching for another city or checking your filter criteria.", icon: Icon = Search, actionButton }) {
  return (
    <div className="glass-card" style={{
      padding: '2.5rem 1.5rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      margin: '1.5rem 0'
    }}>
      <div style={{
        padding: '1rem',
        borderRadius: 'var(--radius-full)',
        background: 'var(--accent-glow)',
        color: 'var(--accent-blue)'
      }}>
        <Icon size={32} />
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px' }}>
        {description}
      </p>
      {actionButton}
    </div>
  );
}
