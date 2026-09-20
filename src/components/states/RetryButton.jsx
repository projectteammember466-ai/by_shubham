import React from 'react';
import { RotateCw } from 'lucide-react';

export function RetryButton({ onRetry, label = "Try Again" }) {
  return (
    <button onClick={onRetry} className="btn-primary" style={{ gap: '0.5rem' }}>
      <RotateCw size={16} />
      <span>{label}</span>
    </button>
  );
}
