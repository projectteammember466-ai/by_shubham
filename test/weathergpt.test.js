import test from 'node:test';
import assert from 'node:assert/strict';

import { getMockWeather, MOCK_WEATHER_DATA, DEFAULT_CITY, ALL_DEMO_CITIES } from '../src/data/weatherData.js';
import { getHourlyForecast, getDailyForecast } from '../src/data/forecastData.js';
import { getMockAlerts, MOCK_ALERTS_BY_CITY } from '../src/data/alertData.js';
import { 
  generateAIChatResponse, 
  extractQueryUnderstanding, 
  INITIAL_SUGGESTED_QUESTIONS, 
  WEATHER_AWARE_QUESTIONS,
  INTENT_DEFINITIONS
} from '../src/data/chatData.js';
import { getMockClimate, MOCK_CLIMATE_BY_CITY } from '../src/data/climateData.js';
import { TRANSLATIONS, getTranslation, SUPPORTED_LANGUAGES } from '../src/data/translations.js';
import { formatTemperature } from '../src/utils/formatTemperature.js';
import { formatWind } from '../src/utils/formatWind.js';

// ==========================================
// A1-A10 Regression Protection Tests
// ==========================================

test('A1 - Project Setup & Architecture Baseline', () => {
  assert.ok(DEFAULT_CITY, 'Default city should be defined');
  assert.equal(DEFAULT_CITY, 'jodhpur');
  assert.ok(MOCK_WEATHER_DATA.jodhpur, 'Jodhpur fixture must exist');
});

test('A4 - Search & Current Weather Tests', () => {
  const jodhpur = getMockWeather('jodhpur');
  assert.equal(jodhpur.location.city, 'Jodhpur');
  assert.equal(typeof jodhpur.current.temperature, 'number');
  assert.ok(jodhpur.metadata.source, 'Metadata source must be defined');

  // Case insensitivity
  const delhi = getMockWeather('DELHI');
  assert.equal(delhi.location.city, 'Delhi');

  // Weather condition fixtures
  assert.equal(getMockWeather('oslo').current.condition, 'Snow');
  assert.equal(getMockWeather('cairo').current.condition, 'Night Clear');
  assert.equal(getMockWeather('miami').current.condition, 'Thunderstorm');

  // Minimal fixture
  const minimal = getMockWeather('minimalCity');
  assert.equal(minimal.location.city, 'Remote Outpost');
  assert.equal(minimal.current.uvIndex, undefined);

  // Long city name fixture
  const longCity = getMockWeather('longcity');
  assert.ok(longCity.location.city.length > 25);

  // Error trigger
  assert.throws(() => getMockWeather('error'), /Weather service connection failed/);
  assert.throws(() => getMockWeather('invalid'), /was not found in weather records/);
});

test('A5 - Forecast Data Tests', () => {
  const hourly = getHourlyForecast(30);
  assert.equal(hourly.length, 8);
  hourly.forEach((item) => {
    assert.ok(item.time);
    assert.equal(typeof item.temp, 'number');
  });

  const daily = getDailyForecast(30);
  assert.equal(daily.length, 7);
  daily.forEach((day) => {
    assert.ok(day.day);
    assert.ok(day.high >= day.low);
  });
});

test('A6 - Alert System & Trust Architecture Baseline', () => {
  const jodhpurAlerts = getMockAlerts('jodhpur');
  assert.ok(jodhpurAlerts.length > 0);
  const alert = jodhpurAlerts[0];
  assert.equal(alert.severity, 'SEVERE');
  assert.ok(alert.officialWarning.source);
  assert.ok(alert.aiExplanation.disclaimer.includes('WeatherGPT interpretation'));

  assert.equal(getMockAlerts('tokyo').length, 0);
});

test('A8 - Formatting Utilities Tests', () => {
  assert.equal(formatTemperature(25, 'C'), '25°C');
  assert.equal(formatTemperature(0, 'F'), '32°F');
  assert.equal(formatTemperature(null), '--°');
  assert.equal(formatWind(20, 'kmh', 'NW'), '20 km/h NW');
  assert.equal(formatWind(10, 'mph', 'E'), '6 mph E');
  assert.equal(formatWind(null), '--');
});

// ==========================================
// A11-A22 Advanced Scope Verification Tests
// ==========================================

test('A11 - Intent Detection & Contextual Follow-Up Extraction', () => {
  // Query with location and time
  const res1 = extractQueryUnderstanding('Kal Jodhpur mein baarish hogi?');
  assert.equal(res1.location, 'Jodhpur');
  assert.equal(res1.time, 'Tomorrow');
  assert.equal(res1.intent, 'RAIN');
  assert.equal(res1.topic, 'Rain Probability');

  // Contextual follow-up inquiry ("What about evening?")
  const prior = { location: 'Jodhpur', time: 'Tomorrow', intent: 'RAIN' };
  const res2 = extractQueryUnderstanding('What about evening?', prior);
  assert.equal(res2.location, 'Jodhpur', 'Inherits location from prior context');
  assert.equal(res2.time, 'Tomorrow Evening', 'Resolves contextual time correctly');
  assert.equal(res2.intent, 'RAIN', 'Inherits intent from prior context');

  // Verify all 16 intents are registered
  const intentKeys = Object.keys(INTENT_DEFINITIONS);
  assert.ok(intentKeys.length >= 16, 'At least 16 intents must be defined');
  assert.ok(intentKeys.includes('FARMING'));
  assert.ok(intentKeys.includes('OUTDOOR_ACTIVITY'));
  assert.ok(intentKeys.includes('TRAVEL'));
  assert.ok(intentKeys.includes('AQI'));
});

test('A12 - Multilingual UI & Response Generation', () => {
  assert.equal(SUPPORTED_LANGUAGES.length, 3, 'English, Hindi, and Hinglish supported');
  
  // English translation
  assert.equal(getTranslation('en', 'dashboard'), 'Dashboard');
  assert.equal(getTranslation('en', 'whyForecast'), 'Why this forecast?');

  // Hindi translation
  assert.equal(getTranslation('hi', 'dashboard'), 'डैशबोर्ड');
  assert.equal(getTranslation('hi', 'rainChance'), 'बारिश की संभावना');

  // Hinglish translation
  assert.equal(getTranslation('hinglish', 'dashboard'), 'Dashboard');
  assert.equal(getTranslation('hinglish', 'rainChance'), 'Baarish ka chance');

  // Multilingual chat responses
  const weather = getMockWeather('jodhpur');
  const enReply = generateAIChatResponse('Will it rain?', weather, 'en');
  const hiReply = generateAIChatResponse('बारिश होगी?', weather, 'hi');
  const hinglishReply = generateAIChatResponse('Baarish hogi?', weather, 'hinglish');

  assert.ok(enReply.text.includes('probability') || enReply.text.includes('unlikely') || enReply.text.includes('rain'));
  assert.ok(hiReply.text.includes('बारिश') || hiReply.text.includes('संभावना'));
  assert.ok(hinglishReply.text.includes('baarish') || hinglishReply.text.includes('rain'));
});

test('A13 - Impact-Based Weather Alerts', () => {
  const mumbaiAlerts = getMockAlerts('mumbai');
  assert.ok(mumbaiAlerts.length > 0);
  const alert = mumbaiAlerts[0];

  assert.ok(alert.expectedConditions, 'Alert must contain expected conditions');
  assert.ok(alert.expectedConditions.includes('mm'), 'Conditions must include quantitative metric');
  assert.ok(Array.isArray(alert.potentialImpacts), 'Potential impacts must be an array');
  assert.ok(alert.potentialImpacts.length >= 2, 'Must have at least 2 impact points');
});

test('A14 & A15 - Confidence, Uncertainty & Why This Forecast', () => {
  const jod = getMockWeather('jodhpur');
  assert.ok(jod.confidence, 'Weather must contain confidence');
  assert.equal(jod.confidence.level, 'High');
  assert.ok(jod.confidence.uncertaintyExplanation);

  assert.ok(jod.whyForecast, 'Weather must contain Why This Forecast breakdown');
  assert.ok(jod.whyForecast.signals.length >= 3, 'Must have at least 3 observed signals');
  assert.ok(jod.whyForecast.reasoning, 'Must have meteorological reasoning');
  assert.ok(jod.whyForecast.aiExplanation, 'Must have plain-language AI explanation');
});

test('A16 - Source, Freshness & Trust Verification', () => {
  const del = getMockWeather('delhi');
  assert.ok(del.metadata.freshness, 'Metadata must have freshness state');
  assert.ok(['Fresh', 'Aging', 'Stale'].includes(del.metadata.freshness));

  const chatResp = generateAIChatResponse('How is the weather?', del, 'en');
  assert.ok(chatResp.richContent.sourcesUsed, 'Response must detail sources used');
  assert.ok(chatResp.richContent.sourcesUsed.length >= 2);
  assert.ok(chatResp.richContent.aiExplanationLabel.includes('WeatherGPT'));
});

test('A17 - User Context Modes', () => {
  const jod = getMockWeather('jodhpur');
  assert.ok(jod.contextAdvice, 'Must provide context advice dictionary');
  assert.ok(jod.contextAdvice.general);
  assert.ok(jod.contextAdvice.farmer);
  assert.ok(jod.contextAdvice.traveler);
  assert.ok(jod.contextAdvice.outdoor);
  assert.ok(jod.contextAdvice.emergency);
});

test('A18 - Location-Aware Interactive Weather Map Data', () => {
  assert.ok(ALL_DEMO_CITIES.length >= 8, 'Map must contain multiple geographic stations');
  
  ALL_DEMO_CITIES.forEach((c) => {
    assert.ok(c.name, 'Station must have name');
    assert.equal(typeof c.lat, 'number', 'Station must have latitude');
    assert.equal(typeof c.lon, 'number', 'Station must have longitude');
    assert.equal(typeof c.temp, 'number', 'Station must have temp');
    assert.ok(c.lat >= -90 && c.lat <= 90);
    assert.ok(c.lon >= -180 && c.lon <= 180);
  });
});

test('A19 - Climate & Historical Weather Data', () => {
  const jodClimate = getMockClimate('jodhpur');
  assert.equal(jodClimate.city, 'Jodhpur');
  assert.ok(jodClimate.annualRainfall);
  assert.ok(jodClimate.annualAvgTemp);
  assert.equal(jodClimate.months.length, 12, 'Climate data must have 12 months');
  jodClimate.months.forEach((m) => {
    assert.ok(m.month);
    assert.ok(m.avgHigh >= m.avgLow);
  });
});

// ==========================================
// Part A Final Polish & Freeze Regression Tests
// ==========================================

test('Part A Final Freeze - Navigation Structure & Terminology Verification', () => {
  // Verify Core Navigation Keys in Translations
  const coreNavKeys = ['dashboard', 'map', 'chat', 'alerts', 'pipeline', 'history', 'settings', 'refresh'];
  SUPPORTED_LANGUAGES.forEach(lang => {
    coreNavKeys.forEach(key => {
      const translated = getTranslation(lang.id, key);
      assert.ok(translated, `Translation key "${key}" must exist for language "${lang.id}"`);
      assert.ok(translated.length > 0);
    });
  });

  // Verify English standardized terminology
  assert.equal(getTranslation('en', 'dashboard'), 'Dashboard');
  assert.equal(getTranslation('en', 'map'), 'Weather Map');
  assert.equal(getTranslation('en', 'chat'), 'AI Chat');
  assert.equal(getTranslation('en', 'alerts'), 'Alerts');
  assert.equal(getTranslation('en', 'pipeline'), 'AI Pipeline');
  assert.equal(getTranslation('en', 'history'), 'History');
  assert.equal(getTranslation('en', 'settings'), 'Settings');
  assert.equal(getTranslation('en', 'refresh'), 'Refresh');
});

