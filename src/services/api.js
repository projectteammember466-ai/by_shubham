// WeatherGPT API Abstraction Layer (Phase-A Mock Boundary & Future Backend Contract)

import { getMockWeather, ALL_DEMO_CITIES } from '../data/weatherData';
import { getHourlyForecast, getDailyForecast } from '../data/forecastData';
import { getMockAlerts } from '../data/alertData';
import { generateAIChatResponse } from '../data/chatData';
import { getMockClimate } from '../data/climateData';

// Simulated async delay to mimic future network requests
const mockDelay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchWeather(city = "jodhpur") {
  await mockDelay(200);
  const data = getMockWeather(city);
  return data;
}

export async function fetchForecast(city = "jodhpur", baseTemp = 30) {
  await mockDelay(180);
  return {
    hourly: getHourlyForecast(baseTemp),
    daily: getDailyForecast(baseTemp)
  };
}

export async function fetchAlerts(city = "jodhpur") {
  await mockDelay(120);
  return getMockAlerts(city);
}

export async function postChatMessage(userQuery, weatherData, lang = 'en', priorContext = {}) {
  await mockDelay(400);
  return generateAIChatResponse(userQuery, weatherData, lang, priorContext);
}

export async function fetchClimate(city = "jodhpur") {
  await mockDelay(150);
  return getMockClimate(city);
}

export async function fetchMapWeather(layers = ['temperature']) {
  await mockDelay(200);
  return {
    cities: ALL_DEMO_CITIES,
    activeLayers: layers,
    timestamp: new Date().toISOString()
  };
}
