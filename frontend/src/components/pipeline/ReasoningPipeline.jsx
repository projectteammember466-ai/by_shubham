import React, { useState } from 'react';
import { HelpCircle, Sparkles, MapPin, Database, ShieldCheck, Compass, MessageSquare, CheckCircle, ArrowDown } from 'lucide-react';

export function ReasoningPipeline({ activeCity = "Jodhpur", sampleQuery = "Will it rain tomorrow in Jodhpur?" }) {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      step: "1",
      title: "User Question",
      icon: MessageSquare,
      summary: "Input query received via text or voice input.",
      detail: `Raw query: "${sampleQuery}". System sanitizes input and passes it to query processing without exposing internal model buffers.`
    },
    {
      step: "2",
      title: "Intent Detection",
      icon: Compass,
      summary: "Detects user focus topic and temporal scope.",
      detail: "Identifies intent as 'RAIN_FORECAST' and time parameter as 'Tomorrow'. Extracted entities: Topic=Precipitation, Timeframe=Next 24h."
    },
    {
      step: "3",
      title: "Location Resolution",
      icon: MapPin,
      summary: "Resolves place names to coordinates and stations.",
      detail: `Matches query keyword to station ${activeCity} (Lat: 26.24°N, Lon: 73.02°E). Validates geographic hierarchy and boundaries.`
    },
    {
      step: "4",
      title: "Weather Retrieval",
      icon: Database,
      summary: "Fetches observation telemetry and numerical forecasts.",
      detail: `Queries normalized data contract for ${activeCity}: surface temperature, radar precipitation probability, humidity, barometric pressure, and active IMD alerts.`
    },
    {
      step: "5",
      title: "Data Validation",
      icon: ShieldCheck,
      summary: "Validates ranges and checks data integrity.",
      detail: "Verifies temperatures are within physical bounds (-50°C to +60°C), rain chances between 0-100%, and marks data freshness timestamp as 'Fresh'."
    },
    {
      step: "6",
      title: "Weather Reasoning",
      icon: Sparkles,
      summary: "Evaluates atmospheric signals against meteorological rules.",
      detail: "Compares low atmospheric moisture with high anticyclonic pressure. Concludes rain probability remains under 10% over the next 24 hours."
    },
    {
      step: "7",
      title: "AI Explanation",
      icon: HelpCircle,
      summary: "Synthesizes clear, plain-language takeaway.",
      detail: "Generates user guidance: 'Rain is unlikely tomorrow in Jodhpur (5%). High temperature of 36°C expected.' Formats practical recommendations."
    },
    {
      step: "8",
      title: "Answer + Sources + Uncertainty",
      icon: CheckCircle,
      summary: "Outputs response with transparent attribution.",
      detail: "Assembles rich response card: Temperature, Rain Chance, Confidence (90%), Attribution (Official Telemetry & NWP model), and Clear Disclaimer."
    }
  ];

  return (
    <div className="glass-card" style={{ padding: '1.75rem', maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <div style={{
          padding: '0.4rem',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--accent-glow)',
          color: 'var(--accent-blue)'
        }}>
          <ShieldCheck size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 850 }}>WeatherGPT Reasoning Pipeline</h1>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Transparent 8-Stage Meteorological Trust Architecture (Viva & Educational Walkthrough)
          </span>
        </div>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '1rem 0 1.5rem 0', lineHeight: 1.5 }}>
        WeatherGPT operates on a strict verification pipeline. It decouples numerical data retrieval from linguistic generation to prevent meteorological hallucinations.
      </p>

      {/* Stepper Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = activeStage === idx;
          return (
            <div
              key={stage.step}
              onClick={() => setActiveStage(idx)}
              style={{
                cursor: 'pointer',
                background: isActive ? 'var(--accent-glow)' : 'var(--surface-color)',
                border: isActive ? '2px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--radius-full)',
                    background: isActive ? 'var(--accent-blue)' : 'var(--surface-card)',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 800
                  }}>
                    {stage.step}
                  </div>
                  <Icon size={18} style={{ color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.98rem', fontWeight: 750, color: 'var(--text-primary)' }}>
                    {stage.title}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {stage.summary}
                </span>
              </div>

              {isActive && (
                <div className="page-fade-in" style={{
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--surface-border)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5
                }}>
                  <strong style={{ color: 'var(--accent-blue)' }}>Pipeline Action: </strong>
                  {stage.detail}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
