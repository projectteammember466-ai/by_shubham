import React from 'react';
import { getSeverityBadgeClass } from '../../utils/weatherHelpers';
import { ShieldAlert } from 'lucide-react';

export function AlertBadge({ severity = 'INFO' }) {
  const badgeClass = getSeverityBadgeClass(severity);

  return (
    <span className={`badge ${badgeClass}`}>
      <ShieldAlert size={12} />
      <span>{severity.toUpperCase()}</span>
    </span>
  );
}
