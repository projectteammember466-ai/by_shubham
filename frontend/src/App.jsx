import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useWeather } from './hooks/useWeather';
import { useLanguage } from './hooks/useLanguage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';

import { Home } from './pages/Home';
import { Chat } from './pages/Chat';
import { Alerts } from './pages/Alerts';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { MapView } from './pages/MapView';
import { PipelineView } from './pages/PipelineView';
import { HistoricalWeather } from './pages/HistoricalWeather';
import { CompareWeather } from './pages/CompareWeather';

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
            onNavigateHistorical={() => setActivePage('historical')}
            onAskAI={handleAskAI}
            lang={lang}
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
            lang={lang}
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
            userMode={weatherState.userMode}
            setUserMode={weatherState.setUserMode}
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
          <PipelineView 
            activeCity={weatherState.weather?.location?.city || weatherState.city} 
            lang={lang}
            t={t}
          />
        );
      case 'compare':
        return (
          <CompareWeather
            initialCityA={weatherState.weather?.location?.city || weatherState.city || 'jodhpur'}
            initialCityB="jaipur"
            tempUnit={weatherState.tempUnit}
            windUnit={weatherState.windUnit}
            userMode={weatherState.userMode}
            lang={lang}
            t={t}
          />
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
            lang={lang}
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
            onSelectCity={(c) => {
              weatherState.setCity(c);
              setActivePage('home');
            }}
            onRequestLocation={weatherState.requestLocation}
            geoState={weatherState.geoState}
            userMode={weatherState.userMode}
            setUserMode={weatherState.setUserMode}
            lang={lang}
            setLang={setLang}
            alertPreferences={weatherState.alertPreferences}
            setAlertPreferences={weatherState.setAlertPreferences}
            t={t}
            onNavigate={setActivePage}
          />
        );
      case 'historical':
        return (
          <HistoricalWeather
            selectedCity={weatherState.city}
            onSelectCity={weatherState.setCity}
            weather={weatherState.weather}
            tempUnit={weatherState.tempUnit}
            windUnit={weatherState.windUnit}
            onNavigateDashboard={() => setActivePage('home')}
            lang={lang}
            t={t}
          />
        );
      default:
        return (
          <Home
            weatherState={weatherState}
            onNavigateChat={() => setActivePage('chat')}
            onNavigateMap={() => setActivePage('map')}
            onNavigateHistorical={() => setActivePage('historical')}
            onAskAI={handleAskAI}
            lang={lang}
            t={t}
          />
        );
    }
  };

  return (
    <div className="app-shell">
      {/* Desktop Vertical Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        theme={theme}
        setTheme={setTheme}
        tempUnit={weatherState.tempUnit}
        setTempUnit={weatherState.setTempUnit}
        city={weatherState.weather?.location?.city || weatherState.city}
        userMode={weatherState.userMode}
        lang={lang}
        setLang={setLang}
        t={t}
      />

      {/* Mobile Top Navigation Header */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        theme={theme}
        setTheme={setTheme}
        tempUnit={weatherState.tempUnit}
        setTempUnit={weatherState.setTempUnit}
        city={weatherState.weather?.location?.city || weatherState.city}
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

      <Footer t={t} lang={lang} />

      <MobileNav activePage={activePage} setActivePage={setActivePage} t={t} />
    </div>
  );
}
