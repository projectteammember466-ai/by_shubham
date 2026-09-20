import React from 'react';
import { Gauge, Eye, Sun, Umbrella, Sunrise, Sunset, Activity, Cloud, Thermometer } from 'lucide-react';

export function WeatherDetails({ current }) {
  if (!current) return null;

  const metrics = [
    { label: "Pressure", value: current.pressure ? `${current.pressure} hPa` : null, icon: Gauge },
    { label: "Visibility", value: current.visibility ? `${current.visibility} km` : null, icon: Eye },
    { label: "UV Index", value: current.uvIndex !== undefined ? `${current.uvIndex} / 10` : null, icon: Sun },
    { label: "Rain Chance", value: current.rainProbability !== undefined ? `${current.rainProbability}%` : null, icon: Umbrella },
    { label: "Sunrise", value: current.sunrise || null, icon: Sunrise },
    { label: "Sunset", value: current.sunset || null, icon: Sunset },
    { label: "Air Quality (AQI)", value: current.aqi ? `${current.aqi} (${current.aqiCategory || ''})` : null, icon: Activity },
    { label: "Cloud Cover", value: current.cloudCover !== undefined ? `${current.cloudCover}%` : null, icon: Cloud },
    { label: "Dew Point", value: current.dewPoint !== undefined ? `${current.dewPoint}°C` : null, icon: Thermometer }
  ].filter(m => m.value !== null);

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
        Detailed Weather Metrics
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '1rem'
      }}>
        {metrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                <Icon size={16} style={{ color: 'var(--accent-blue)' }} />
                <span>{item.label}</span>
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
