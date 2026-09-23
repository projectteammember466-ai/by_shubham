import React, { useState } from 'react';
import { 
  Sparkles, User, Info, MapPin, Thermometer, Umbrella, Wind, Droplets, 
  Volume2, VolumeX, ShieldCheck, CheckCircle2, AlertTriangle, Compass 
} from 'lucide-react';
import { ChatIntentCard } from './ChatIntentCard';

export function ChatMessage({ message, t = (k, f) => f || k }) {
  const isUser = message.sender === 'user';
  const { text, timestamp, richContent, understanding } = message;
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      margin: '0.75rem 0',
      width: '100%'
    }}>
      {/* Sender & Timestamp */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        marginBottom: '0.25rem'
      }}>
        {isUser ? (
          <>
            <span>{t('you', 'You')}</span>
            <User size={12} />
          </>
        ) : (
          <>
            <Sparkles size={12} style={{ color: 'var(--accent-blue)' }} />
            <span>WeatherGPT AI</span>
          </>
        )}
        <span>• {timestamp}</span>
      </div>

      {/* Query Understanding Card if extracted (A11) */}
      {!isUser && understanding && (
        <div style={{ width: '100%', maxWidth: '85%' }}>
          <ChatIntentCard understanding={understanding} t={t} />
        </div>
      )}

      {/* Main Message Bubble */}
      <div style={{
        maxWidth: '85%',
        padding: '0.85rem 1.15rem',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser 
          ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-indigo))' 
          : 'var(--surface-card)',
        color: isUser ? '#ffffff' : 'var(--text-primary)',
        border: isUser ? 'none' : '1px solid var(--surface-border)',
        boxShadow: 'var(--shadow-sm)',
        lineHeight: 1.5,
        fontSize: '0.92rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <p style={{ margin: 0, flex: 1 }}>{text}</p>
          {!isUser && 'speechSynthesis' in window && (
            <button
              onClick={handleSpeak}
              title={isPlaying ? "Stop reading" : "Read aloud"}
              aria-label={isPlaying ? "Stop speech playback" : "Read response aloud"}
              style={{
                background: 'transparent',
                border: 'none',
                color: isPlaying ? 'var(--accent-blue)' : 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.2rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          )}
        </div>

        {/* Embedded Rich Weather Response Card */}
        {richContent && (
          <div style={{
            marginTop: '0.85rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--surface-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            fontSize: '0.82rem'
          }}>
            {/* Metric Chips Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-blue)', background: 'var(--accent-glow)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                <MapPin size={13} /> {richContent.city}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--surface-color)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                <Thermometer size={13} /> {richContent.temp}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--surface-color)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                <Umbrella size={13} /> {richContent.rainProbability}
              </span>
              {richContent.wind && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--surface-color)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  <Wind size={13} /> {richContent.wind}
                </span>
              )}
              {richContent.contextLabel && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-indigo)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  <Compass size={13} /> {richContent.contextLabel}
                </span>
              )}
            </div>

            {/* STRICT SEPARATION: Official Warning vs AI Guidance */}
            {richContent.officialWarning && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                borderLeft: '3px solid #ef4444',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                color: '#ef4444',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.4rem'
              }}>
                <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.15rem' }}>
                    {t('officialWarning', 'Official Warning / Advisory')}
                  </strong>
                  <span>{richContent.officialWarning}</span>
                </div>
              </div>
            )}

            {/* AI Guidance */}
            {(richContent.aiGuidance || richContent.tip) && (
              <div style={{
                background: 'rgba(56, 189, 248, 0.1)',
                borderLeft: '3px solid var(--accent-blue)',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.4rem'
              }}>
                <Sparkles size={15} style={{ color: 'var(--accent-blue)', flexShrink: 0, marginTop: '0.1rem' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.15rem', color: 'var(--accent-blue)' }}>
                    {t('aiGuidance', 'WeatherGPT AI Guidance')}
                  </strong>
                  <span>{richContent.aiGuidance || richContent.tip}</span>
                </div>
              </div>
            )}

            {/* Impact */}
            {richContent.impact && (
              <div style={{
                background: 'rgba(234, 179, 8, 0.1)',
                borderLeft: '3px solid #eab308',
                padding: '0.45rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem'
              }}>
                <strong>{t('potentialImpact', 'Potential Impact')}: </strong>{richContent.impact}
              </div>
            )}

            {/* Sources Used Checklist */}
            {richContent.sourcesUsed && (
              <div style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                background: 'var(--surface-color)',
                padding: '0.45rem 0.65rem',
                borderRadius: 'var(--radius-sm)'
              }}>
                <span style={{ fontWeight: 700, display: 'block', marginBottom: '0.2rem', color: 'var(--text-secondary)' }}>
                  {t('sourcesUsed', 'Sources Used')}:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {richContent.sourcesUsed.map((s, idx) => (
                    <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981' }}>
                      <CheckCircle2 size={11} /> {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer & AI attribution */}
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Info size={11} />
              <span>{richContent.aiExplanationLabel || "WeatherGPT AI Synthesis"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
