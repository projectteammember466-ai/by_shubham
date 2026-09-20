import React from 'react';
import { ChatBox } from '../components/chat/ChatBox';

export function Chat({ weather, initialQuery, lang = 'en', setLang, t = (k) => k }) {
  return (
    <div className="page-fade-in" style={{ padding: '0.5rem 0' }}>
      <ChatBox
        weatherData={weather}
        initialMessage={initialQuery}
        lang={lang}
        setLang={setLang}
        t={t}
      />
    </div>
  );
}
