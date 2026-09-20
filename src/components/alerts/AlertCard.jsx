import React, { useState } from 'react';
import { AlertBadge } from './AlertBadge';
import { ShieldCheck, Sparkles, MapPin, Calendar, ChevronDown, ChevronUp, AlertOctagon, HelpCircle, ArrowRight } from 'lucide-react';

export function AlertCard({ alert, t = (k) => k }) {
  const [expanded, setExpanded] = useState(true);

  if (!alert) return null;

  return (
    <div className="glass-card" style={{
      padding: '1.25rem',
      borderColor: alert.severity === 'EXTREME' || alert.severity === 'SEVERE' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(234, 179, 8, 0.3)',
      background: alert.severity === 'EXTREME' || alert.severity === 'SEVERE' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(234, 179, 8, 0.05)',
      margin: '1rem 0'
    }}>
      {/* Alert Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <AlertBadge severity={alert.severity} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {alert.title}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={13} style={{ color: 'var(--accent-blue)' }} /> {alert.affectedArea}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={13} /> {alert.validFrom} to {alert.validUntil}
            </span>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          style={{ padding: '0.35rem', color: 'var(--text-muted)' }}
          aria-label={expanded ? "Collapse details" : "Expand details"}
        >
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {expanded && (
        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Section 1: OFFICIAL WARNING (Authority Attributed) */}
          <div style={{
            background: 'var(--surface-card)',
            padding: '1.1rem',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid #ef4444',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderLeftWidth: '5px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 900, color: '#ef4444', letterSpacing: '0.05em' }}>
                <ShieldCheck size={16} /> OFFICIAL GOVERNMENT / MET AUTHORITY WARNING
              </div>
              <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Verified Feed</span>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
              Source: <strong>{alert.officialWarning?.source}</strong> ({alert.officialWarning?.sourceType})
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>
              {alert.officialWarning?.description}
            </p>
          </div>

          {/* Section 2: Expected Conditions & Potential Impacts (A13) */}
          {(alert.expectedConditions || (alert.potentialImpacts && alert.potentialImpacts.length > 0)) && (
            <div style={{
              background: 'var(--surface-color)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--surface-border)'
            }}>
              {alert.expectedConditions && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                    ⚡ {t('expectedConditions', 'Expected Conditions')}:
                  </span>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    {alert.expectedConditions}
                  </p>
                </div>
              )}

              {alert.potentialImpacts && alert.potentialImpacts.length > 0 && (
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                    ⚠️ {t('potentialImpacts', 'Potential Impacts')}:
                  </span>
                  <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {alert.potentialImpacts.map((impact, i) => (
                      <li key={i}>{impact}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Section 3: AI EXPLANATION & GUIDANCE */}
          <div style={{
            background: 'var(--surface-color)',
            padding: '1.1rem',
            borderRadius: 'var(--radius-md)',
            borderLeft: '5px solid var(--accent-blue)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderLeftWidth: '5px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 900, color: 'var(--accent-blue)', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              <Sparkles size={16} /> WEATHERGPT AI EXPLANATION & IMPACT ASSESSMENT
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '0.65rem' }}>
              {alert.aiExplanation?.disclaimer}
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              {alert.aiExplanation?.summary}
            </p>

            {alert.aiExplanation?.recommendedAction && (
              <div style={{
                background: 'var(--accent-glow)',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--accent-blue)'
              }}>
                💡 <strong>{t('recommendedActions', 'Recommended Guidance')}:</strong> {alert.aiExplanation.recommendedAction}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
