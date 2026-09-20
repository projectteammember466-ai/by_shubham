import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, RefreshCw, AlertCircle, RotateCw, Globe } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { SuggestedQuestions } from './SuggestedQuestions';
import { VoiceInput } from './VoiceInput';
import { postChatMessage } from '../../services/api';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { extractQueryUnderstanding } from '../../data/chatData';
import { SUPPORTED_LANGUAGES } from '../../data/translations';

export function ChatBox({ weatherData, initialMessage, lang = 'en', setLang, t = (k) => k }) {
  const [messages, setMessages] = useLocalStorage('weathergpt_chat_history', [
    {
      id: 'msg-welcome',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hello! I'm WeatherGPT, your AI Weather Assistant. Ask me anything about the weather in ${weatherData?.location?.city || 'Jodhpur'} or any city worldwide! You can ask in English, Hindi, or Hinglish.`,
      richContent: {
        city: weatherData?.location?.city || 'Jodhpur',
        temp: `${weatherData?.current?.temperature || 30}°C`,
        condition: weatherData?.current?.condition || 'Sunny',
        rainProbability: `${weatherData?.current?.rainProbability || 10}%`,
        tip: "Ask me 'Will it rain today?' or 'Kal Jodhpur mein baarish hogi?'",
        sourcesUsed: ["Current Telemetry", "Deterministic Forecast"],
        aiExplanationLabel: "WeatherGPT AI Synthesis (Mock Baseline)"
      }
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [priorContext, setPriorContext] = useState({
    location: weatherData?.location?.city || 'Jodhpur',
    time: 'Today',
    intent: 'CURRENT_WEATHER'
  });
  const [lastFailedQuery, setLastFailedQuery] = useState(null);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialMessage) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    setError('');
    setLastFailedQuery(null);

    // Extract understanding for user message tracking
    const understanding = extractQueryUnderstanding(query, priorContext);
    setPriorContext({
      location: understanding.location || priorContext.location,
      time: understanding.time || priorContext.time,
      intent: understanding.intent || priorContext.intent
    });

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      if (query.toLowerCase() === 'error' || query.toLowerCase() === 'fail') {
        throw new Error("Simulated AI service timeout. Please try again.");
      }
      const response = await postChatMessage(query, weatherData, lang, priorContext);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message || "Failed to generate AI weather response. Please try again.");
      setLastFailedQuery(query);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetryLast = () => {
    if (lastFailedQuery) {
      handleSendMessage(lastFailedQuery);
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setInput(transcript); // Speech text fills input for verification; does NOT auto-submit (A21)
  };

  const handleClearChat = () => {
    setMessages([]);
    setError('');
    setLastFailedQuery(null);
    setPriorContext({
      location: weatherData?.location?.city || 'Jodhpur',
      time: 'Today',
      intent: 'CURRENT_WEATHER'
    });
  };

  return (
    <div className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 12rem)',
      minHeight: '560px',
      padding: '1.25rem',
      maxWidth: '850px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--surface-border)',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            padding: '0.4rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-glow)',
            color: 'var(--accent-blue)'
          }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800 }}>WeatherGPT AI Assistant</h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Context: {weatherData?.location?.city || 'Global'} • Temporal focus: {priorContext.time}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Quick Language Selector (A12) */}
          {setLang && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--surface-color)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-border)' }}>
              <Globe size={13} style={{ color: 'var(--accent-blue)' }} />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.75rem',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                aria-label="Select chat language"
              >
                {SUPPORTED_LANGUAGES.map(l => (
                  <option key={l.id} value={l.id} style={{ background: 'var(--surface-card)', color: 'var(--text-primary)' }}>
                    {l.native}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleClearChat}
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--surface-border)',
              background: 'var(--surface-color)'
            }}
            title="Clear Conversation History"
          >
            <RefreshCw size={12} /> Clear Chat
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div 
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: '0.5rem',
          display: 'flex',
          flexDirection: 'column'
        }}
        role="log"
        aria-live="polite"
        aria-label="Conversation messages"
      >
        {messages.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Sparkles size={36} style={{ color: 'var(--accent-blue)', margin: '0 auto 0.75rem auto' }} />
            <p style={{ fontWeight: 600 }}>Conversation is cleared.</p>
            <p style={{ fontSize: '0.85rem' }}>Pick a suggested question below or type your question in English or Hindi.</p>
          </div>
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} t={t} />)
        )}

        {isTyping && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: '0.5rem 0',
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
            padding: '0.5rem 0.75rem',
            background: 'var(--surface-card)',
            borderRadius: 'var(--radius-md)',
            alignSelf: 'flex-start'
          }}>
            <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent-blue)', animation: 'spin 1s linear infinite' }} />
            <span>Analyzing contextual weather patterns...</span>
          </div>
        )}

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            color: '#ef4444',
            fontSize: '0.82rem',
            padding: '0.75rem 1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            margin: '0.5rem 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
            {lastFailedQuery && (
              <button
                onClick={handleRetryLast}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#ef4444',
                  background: 'rgba(239, 68, 68, 0.15)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <RotateCw size={12} /> Retry
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <SuggestedQuestions onSelectQuestion={(q) => handleSendMessage(q)} weatherAware={true} />

      {/* Input Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--surface-border)'
        }}
      >
        <VoiceInput onTranscript={handleVoiceTranscript} disabled={isTyping} />

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('typeQuestion', 'Ask WeatherGPT about rain, temperature, or recommendations...')}
          disabled={isTyping}
          aria-label="Ask WeatherGPT message input"
          style={{
            flex: 1,
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface-color)',
            border: '1px solid var(--surface-border)',
            fontSize: '0.9rem',
            color: 'var(--text-primary)'
          }}
        />

        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="btn-primary"
          aria-label="Send message"
          style={{
            padding: '0.65rem 1.1rem',
            opacity: (!input.trim() || isTyping) ? 0.5 : 1,
            cursor: (!input.trim() || isTyping) ? 'not-allowed' : 'pointer'
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
