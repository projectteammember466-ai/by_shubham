import React, { useState } from 'react';
import { TrendingUp, Table } from 'lucide-react';
import { formatTemperature } from '../../utils/formatTemperature';

export function WeatherChart({ hourly = [], tempUnit }) {
  const [showTable, setShowTable] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);

  if (!hourly || hourly.length === 0) return null;

  const temps = hourly.map(h => h.temp);
  const minTemp = Math.min(...temps) - 2;
  const maxTemp = Math.max(...temps) + 2;
  const range = maxTemp - minTemp || 1;

  const width = 600;
  const height = 200;
  const paddingX = 40;
  const paddingY = 40;

  const points = hourly.map((item, index) => {
    const x = paddingX + (index * (width - 2 * paddingX)) / (hourly.length - 1);
    const y = height - paddingY - ((item.temp - minTemp) * (height - 2 * paddingY)) / range;
    return { ...item, x, y };
  });

  const svgPath = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  return (
    <div className="glass-card" style={{ padding: '1.25rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={18} style={{ color: 'var(--accent-blue)' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>24-Hour Temperature Trend Graph</h2>
        </div>
        <button
          onClick={() => setShowTable(!showTable)}
          className="btn-secondary"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
          aria-label={showTable ? "Switch to graph view" : "Switch to accessible data table view"}
        >
          <Table size={14} />
          <span>{showTable ? 'View Graph' : 'Accessible Table'}</span>
        </button>
      </div>

      {showTable ? (
        <div style={{ overflowX: 'auto' }}>
          <table 
            style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}
            aria-label="24-Hour Temperature Forecast Table"
          >
            <thead>
              <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.6rem', textAlign: 'left' }}>Time</th>
                <th style={{ padding: '0.6rem', textAlign: 'left' }}>Condition</th>
                <th style={{ padding: '0.6rem', textAlign: 'right' }}>Temperature</th>
                <th style={{ padding: '0.6rem', textAlign: 'right' }}>Rain Chance</th>
              </tr>
            </thead>
            <tbody>
              {hourly.map((h) => (
                <tr key={h.id} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <td style={{ padding: '0.6rem', fontWeight: 600 }}>{h.time}</td>
                  <td style={{ padding: '0.6rem', color: 'var(--text-secondary)' }}>{h.condition}</td>
                  <td style={{ padding: '0.6rem', textAlign: 'right', fontWeight: 700 }}>{formatTemperature(h.temp, tempUnit)}</td>
                  <td style={{ padding: '0.6rem', textAlign: 'right', color: '#38bdf8' }}>{h.rainProbability}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: '100%', minWidth: '420px', height: 'auto', display: 'block' }}
            role="img"
            aria-label="Interactive 24-hour temperature trend graph"
          >
            <title>24-Hour Temperature Trend</title>
            <desc>Temperature curve showing temperatures from {formatTemperature(minTemp + 2, tempUnit)} to {formatTemperature(maxTemp - 2, tempUnit)} throughout the day.</desc>

            {/* Grid Lines */}
            <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="var(--surface-border)" strokeDasharray="4" />
            <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="var(--surface-border)" strokeDasharray="4" />
            <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="var(--surface-border)" strokeDasharray="4" />

            {/* Gradient Fill under path */}
            <defs>
              <linearGradient id="chartFillGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <path
              d={`${svgPath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`}
              fill="url(#chartFillGradient)"
            />

            {/* Main Trend Line */}
            <path
              d={svgPath}
              fill="none"
              stroke="var(--accent-blue)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points */}
            {points.map((pt, idx) => {
              const isSelected = selectedPoint?.id === pt.id;
              return (
                <g 
                  key={idx} 
                  tabIndex={0}
                  role="button"
                  aria-label={`${pt.time}: ${formatTemperature(pt.temp, tempUnit)}, ${pt.condition}`}
                  onMouseEnter={() => setSelectedPoint(pt)}
                  onMouseLeave={() => setSelectedPoint(null)}
                  onFocus={() => setSelectedPoint(pt)}
                  onBlur={() => setSelectedPoint(null)}
                  style={{ cursor: 'pointer', outline: 'none' }}
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 6 : 4}
                    fill={isSelected ? "var(--accent-blue)" : "var(--surface-card)"}
                    stroke="var(--accent-blue)"
                    strokeWidth={isSelected ? 3 : 2}
                    style={{ transition: 'all 0.15s ease' }}
                  />
                  {/* Temperature text */}
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    fill="var(--text-primary)"
                    fontSize={isSelected ? "12" : "11"}
                    fontWeight={isSelected ? "800" : "600"}
                  >
                    {formatTemperature(pt.temp, tempUnit)}
                  </text>
                  {/* Time label */}
                  <text
                    x={pt.x}
                    y={height - 12}
                    textAnchor="middle"
                    fill={isSelected ? "var(--text-primary)" : "var(--text-muted)"}
                    fontSize="10"
                    fontWeight={isSelected ? "700" : "500"}
                  >
                    {pt.time}
                  </text>
                </g>
              );
            })}
          </svg>

          {selectedPoint && (
            <div style={{
              textAlign: 'center',
              marginTop: '0.5rem',
              fontSize: '0.82rem',
              color: 'var(--accent-blue)',
              fontWeight: 600
            }}>
              Selected: {selectedPoint.time} • {formatTemperature(selectedPoint.temp, tempUnit)} • {selectedPoint.condition} (Rain: {selectedPoint.rainProbability}%)
            </div>
          )}
        </div>
      )}
    </div>
  );
}
