import React from 'react';
import { SearchBar } from '../components/search/SearchBar';
import { WeatherHero } from '../components/weather/WeatherHero';
import { WeatherDetails } from '../components/weather/WeatherDetails';
import { HourlyForecast } from '../components/weather/HourlyForecast';
import { DailyForecast } from '../components/weather/DailyForecast';
import { WeatherChart } from '../components/weather/WeatherChart';
import { AlertDetails } from '../components/alerts/AlertDetails';
import { WeatherSummary } from '../components/chat/WeatherSummary';
import { Loading } from '../components/states/Loading';
import { ErrorMessage } from '../components/states/ErrorMessage';
import { UserContextModeSelector } from '../components/weather/UserContextModeSelector';
import { ClimateSummary } from '../components/weather/ClimateSummary';
import { WeatherMap } from '../components/map/WeatherMap';
import { SuggestedQuestions } from '../components/chat/SuggestedQuestions';
import { MapPin, ArrowRight } from 'lucide-react';

export function Home({ weatherState, onNavigateChat, onNavigateMap, onAskAI, t = (k) => k }) {
  const {
    city,
    setCity,
    weather,
    forecast,
    alerts,
    climate,
    loading,
    error,
    retry,
    tempUnit,
    windUnit,
    userMode,
    setUserMode,
    mapLayer,
    setMapLayer,
    searchHistory,
    geoState,
    requestLocation
  } = weatherState;

  return (
    <div className="page-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Search Header Section */}
      <section style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 850, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Real-Time Weather Intelligence
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
          Ask natural questions or search any city to view atmospheric forecasts, interactive maps, and AI insights.
        </p>

        <SearchBar
          onSearchCity={setCity}
          onAskAI={onAskAI}
          onRequestLocation={requestLocation}
          geoState={geoState}
          searchHistory={searchHistory}
        />

        {geoState.message && (
          <p style={{
            fontSize: '0.8rem',
            marginTop: '0.65rem',
            color: geoState.status === 'denied' || geoState.status === 'error' ? '#ef4444' : 'var(--accent-blue)',
            fontWeight: 600
          }}>
            {geoState.message}
          </p>
        )}

        {/* User Context Mode Selector (A17) */}
        <UserContextModeSelector
          userMode={userMode}
          onSelectMode={setUserMode}
          advice={weather?.contextAdvice}
          t={t}
        />
      </section>

      {/* Main Content Area */}
      {loading ? (
        <Loading message={`Fetching weather data for ${city}...`} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={retry} />
      ) : weather ? (
        <>
          <div className="dashboard-grid">
            {/* Main Left Dashboard Column: Current Weather -> Important Details -> Hourly -> Graph */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <WeatherHero 
                weather={weather} 
                tempUnit={tempUnit} 
                windUnit={windUnit} 
                onRefresh={retry}
                isRefreshing={loading}
                t={t} 
              />
              <WeatherDetails current={weather.current} />
              <HourlyForecast hourly={forecast?.hourly} tempUnit={tempUnit} />
              <WeatherChart hourly={forecast?.hourly} tempUnit={tempUnit} />
            </div>

            {/* Right Sidebar Column: Weather Alerts -> Daily Forecast -> AI Weather Summary -> Suggested Questions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <AlertDetails alerts={alerts} city={weather.location.city} t={t} />
              <DailyForecast daily={forecast?.daily} tempUnit={tempUnit} />
              <WeatherSummary weather={weather} onOpenChat={() => onNavigateChat()} />
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <SuggestedQuestions onSelectQuestion={onAskAI} weatherAware={true} />
              </div>
            </div>
          </div>

          {/* Integrated Interactive Weather Map Section (A18) */}
          <section style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Geospatial Weather Radar & Map</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Interactive weather overlay synchronized with search and dashboard selection.
                </p>
              </div>
              <button
                onClick={onNavigateMap}
                className="btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', gap: '0.35rem' }}
              >
                <span>Full Map View</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <WeatherMap
              selectedCity={city}
              onSelectCity={setCity}
              activeLayer={mapLayer}
              onSelectLayer={setMapLayer}
              geoCoords={geoState?.coords}
              tempUnit={tempUnit}
              windUnit={windUnit}
              t={t}
            />
          </section>

          {/* Climate & Historical Weather Section (A19) */}
          <section style={{ marginTop: '0.5rem' }}>
            <ClimateSummary climate={climate} tempUnit={tempUnit} t={t} />
          </section>
        </>
      ) : null}
    </div>
  );
}
