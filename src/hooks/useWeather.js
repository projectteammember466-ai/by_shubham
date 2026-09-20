// Weather State Management Hook (Enhanced for A11-A22)

import { useState, useEffect, useCallback } from 'react';
import { fetchWeather, fetchForecast, fetchAlerts, fetchClimate } from '../services/api';
import { useLocalStorage } from './useLocalStorage';

export function useWeather(initialCity = 'jodhpur') {
  const [city, setCity] = useState(initialCity);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [climate, setClimate] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Settings preferences persisted in localStorage
  const [tempUnit, setTempUnit] = useLocalStorage('weathergpt_temp_unit', 'C'); // 'C' | 'F'
  const [windUnit, setWindUnit] = useLocalStorage('weathergpt_wind_unit', 'kmh'); // 'kmh' | 'mph'

  // User Context Mode (A17): 'general' | 'farmer' | 'traveler' | 'outdoor' | 'emergency'
  const [userMode, setUserMode] = useLocalStorage('weathergpt_user_mode', 'general');

  // Smart Alert Preferences (A20)
  const [alertPreferences, setAlertPreferences] = useLocalStorage('weathergpt_alert_prefs', {
    types: {
      heavyRain: true,
      thunderstorm: true,
      extremeHeat: true,
      strongWind: true,
      poorAQI: true,
      extremeCold: true
    },
    frequency: 'immediate' // 'immediate' | 'important' | 'daily'
  });

  // History state
  const [searchHistory, setSearchHistory] = useLocalStorage('weathergpt_search_history', []);

  // Location Geolocation state
  const [geoState, setGeoState] = useState({ status: 'idle', message: '', coords: null });

  // Map layer state (A18)
  const [mapLayer, setMapLayer] = useState('temperature'); // 'temperature' | 'rain' | 'wind' | 'clouds' | 'alerts' | 'aqi'

  const loadWeatherData = useCallback(async (targetCity) => {
    setLoading(true);
    setError(null);

    try {
      const weatherRes = await fetchWeather(targetCity);
      const forecastRes = await fetchForecast(targetCity, weatherRes.current.temperature);
      const alertsRes = await fetchAlerts(targetCity);
      const climateRes = await fetchClimate(targetCity);

      setWeather(weatherRes);
      setForecast(forecastRes);
      setAlerts(alertsRes);
      setClimate(climateRes);

      // Save to search history if valid
      if (weatherRes?.location?.city) {
        setSearchHistory((prev) => {
          const filtered = prev.filter(
            (item) => item.city.toLowerCase() !== weatherRes.location.city.toLowerCase()
          );
          return [
            {
              city: weatherRes.location.city,
              country: weatherRes.location.country,
              query: targetCity,
              timestamp: new Date().toISOString()
            },
            ...filtered
          ].slice(0, 10);
        });
      }

      // Update weather atmosphere on document body
      const cond = weatherRes.current.condition.toLowerCase();
      document.body.classList.remove(
        'weather-sunny', 'weather-cloudy', 'weather-rain', 
        'weather-storm', 'weather-snow', 'weather-night'
      );

      if (cond.includes('rain') || cond.includes('shower')) {
        document.body.classList.add('weather-rain');
      } else if (cond.includes('storm') || cond.includes('thunder')) {
        document.body.classList.add('weather-storm');
      } else if (cond.includes('snow') || cond.includes('blizzard')) {
        document.body.classList.add('weather-snow');
      } else if (cond.includes('cloud')) {
        document.body.classList.add('weather-cloudy');
      } else if (cond.includes('night')) {
        document.body.classList.add('weather-night');
      } else {
        document.body.classList.add('weather-sunny');
      }

    } catch (err) {
      console.error("Failed to load weather data:", err);
      setError(err.message || "Weather data couldn't be loaded. Please check your query or try again.");
    } finally {
      setLoading(false);
    }
  }, [setSearchHistory]);

  useEffect(() => {
    loadWeatherData(city);
  }, [city, loadWeatherData]);

  // Request browser geolocation & map nearest supported city
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setGeoState({ status: 'unavailable', message: 'Geolocation is not supported by your browser.' });
      return;
    }

    setGeoState({ status: 'requesting', message: 'Detecting coordinates via browser geolocation...' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGeoState({
          status: 'success',
          message: 'Location resolved! Centering nearby demo station (Jodhpur).',
          coords: { latitude, longitude }
        });
        // Select nearest supported city
        setCity('jodhpur');
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGeoState({
            status: 'denied',
            message: 'Location access denied. Please search for a city or select from the map.'
          });
        } else {
          setGeoState({
            status: 'error',
            message: 'Could not resolve location coordinates. Using default city.'
          });
        }
      },
      { timeout: 8000 }
    );
  };

  // Bi-directional map city selector
  const selectCityFromMap = (cityName) => {
    if (cityName && cityName.toLowerCase() !== city.toLowerCase()) {
      setCity(cityName);
    }
  };

  const clearHistory = () => setSearchHistory([]);

  return {
    city,
    setCity,
    weather,
    forecast,
    alerts,
    climate,
    loading,
    error,
    retry: () => loadWeatherData(city),
    tempUnit,
    setTempUnit,
    windUnit,
    setWindUnit,
    userMode,
    setUserMode,
    alertPreferences,
    setAlertPreferences,
    mapLayer,
    setMapLayer,
    selectCityFromMap,
    searchHistory,
    clearHistory,
    geoState,
    requestLocation
  };
}
