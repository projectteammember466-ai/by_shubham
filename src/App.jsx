import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useWeather } from './hooks/useWeather';
import { useLanguage } from './hooks/useLanguage';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';

import { Home } from './pages/Home';
import { Chat } from './pages/Chat';
import { Alerts } from './pages/Alerts';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { MapView } from './pages/MapView';
import { PipelineView } from './pages/PipelineView';

export default function App() {
  const [theme, setTheme] = useTheme();
  const { lang, setLang, t } = useLanguage();
  const weatherState = useWeather('jodhpur');
  const [activePage, setActivePage] = useState('home');
  const [chatQuery, setChatQuery] = useState('');

  const handleAskAI = (queryText) => {
    setChatQuery(queryText);
    setActivePage('chat');
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return (
          <Home
            weatherState={weatherState}
            onNavigateChat={() => setActivePage('chat')}
            onNavigateMap={() => setActivePage('map')}
            onAskAI={handleAskAI}
            t={t}
          />
        );
      case 'map':
        return (
          <MapView
            selectedCity={weatherState.city}
            onSelectCity={weatherState.setCity}
            activeLayer={weatherState.mapLayer}
            onSelectLayer={weatherState.setMapLayer}
            geoState={weatherState.geoState}
            weather={weatherState.weather}
            tempUnit={weatherState.tempUnit}
            windUnit={weatherState.windUnit}
            onNavigateDashboard={() => setActivePage('home')}
            t={t}
          />
        );
      case 'chat':
        return (
          <Chat
            weather={weatherState.weather}
            initialQuery={chatQuery}
            lang={lang}
            setLang={setLang}
            t={t}
          />
        );
      case 'alerts':
        return (
          <Alerts
            alerts={weatherState.alerts}
            city={weatherState.weather?.location?.city}
            alertPreferences={weatherState.alertPreferences}
            onNavigateSettings={() => setActivePage('settings')}
            t={t}
          />
        );
      case 'pipeline':
        return (
          <PipelineView activeCity={weatherState.weather?.location?.city || weatherState.city} />
        );
      case 'history':
        return (
          <History
            searchHistory={weatherState.searchHistory}
            onSelectCity={(city) => {
              weatherState.setCity(city);
              setActivePage('home');
            }}
            onClearHistory={weatherState.clearHistory}
            t={t}
          />
        );
      case 'settings':
        return (
          <Settings
            theme={theme}
            setTheme={setTheme}
            tempUnit={weatherState.tempUnit}
            setTempUnit={weatherState.setTempUnit}
            windUnit={weatherState.windUnit}
            setWindUnit={weatherState.setWindUnit}
            city={weatherState.city}
            onRequestLocation={weatherState.requestLocation}
            geoState={weatherState.geoState}
            userMode={weatherState.userMode}
            setUserMode={weatherState.setUserMode}
            lang={lang}
            setLang={setLang}
            alertPreferences={weatherState.alertPreferences}
            setAlertPreferences={weatherState.setAlertPreferences}
            t={t}
          />
        );
      default:
        return (
          <Home
            weatherState={weatherState}
            onNavigateChat={() => setActivePage('chat')}
            onNavigateMap={() => setActivePage('map')}
            onAskAI={handleAskAI}
            t={t}
          />
        );
    }
  };

  return (
    <div className="app-shell">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        theme={theme}
        setTheme={setTheme}
        tempUnit={weatherState.tempUnit}
        setTempUnit={weatherState.setTempUnit}
        city={weatherState.city}
        onRequestLocation={weatherState.requestLocation}
        userMode={weatherState.userMode}
        lang={lang}
        setLang={setLang}
        t={t}
      />

      <main className="app-main">
        <div className="container">
          {renderActivePage()}
        </div>
      </main>

      <Footer />

      <MobileNav activePage={activePage} setActivePage={setActivePage} t={t} />
    </div>
  );
}
