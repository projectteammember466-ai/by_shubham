// AI Weather Chat Mock Generator, Intent Detection & Multilingual Responses (A11, A12, A16)

export const INITIAL_SUGGESTED_QUESTIONS = [
  "What's the weather today?",
  "Will it rain today?",
  "What's the temperature in Jodhpur?",
  "Kal Jodhpur mein baarish hogi?",
  "Should I carry an umbrella?"
];

export const WEATHER_AWARE_QUESTIONS = [
  "How hot will it get this afternoon?",
  "Will it cool down tonight?",
  "Will it rain later today?",
  "What are the farming recommendations today?",
  "How is the air quality (AQI) today?"
];

// 16 Standard WeatherGPT Intents
export const INTENT_DEFINITIONS = {
  CURRENT_WEATHER: { label: "Current Weather", topic: "Current Conditions" },
  FORECAST: { label: "Forecast Inquiry", topic: "Multi-day Forecast" },
  RAIN: { label: "Precipitation & Rain", topic: "Rain Probability" },
  TEMPERATURE: { label: "Temperature & Heat", topic: "Thermal Profile" },
  WIND: { label: "Wind & Gusts", topic: "Atmospheric Flow" },
  HUMIDITY: { label: "Humidity & Moisture", topic: "Moisture Levels" },
  AQI: { label: "Air Quality Index", topic: "Particulate Pollution" },
  UV: { label: "UV Index & Sun", topic: "Solar Radiation" },
  ALERT: { label: "Weather Warning Check", topic: "Hazard Alerts" },
  TRAVEL: { label: "Travel & Transit Impact", topic: "Commute Advisory" },
  OUTDOOR_ACTIVITY: { label: "Outdoor Suitability", topic: "Sports & Recreation" },
  FARMING: { label: "Agricultural Weather", topic: "Crop & Soil Impact" },
  HEALTH: { label: "Health & Sensitivity", topic: "Biometeorology" },
  WEATHER_RISK: { label: "Severe Weather Risk", topic: "Storm & Flood Risk" },
  COMPARISON: { label: "City Weather Comparison", topic: "Comparative Analysis" },
  HISTORICAL_WEATHER: { label: "Climate & History", topic: "Long-term Climate" }
};

/**
 * Extracts intent, entities (location, time, topic), and context from query
 */
export function extractQueryUnderstanding(userQuery, priorContext = {}) {
  const query = userQuery.toLowerCase().trim();

  // 1. Time extraction
  let time = "Today";
  if (query.includes("kal") || query.includes("tomorrow") || query.includes("aane wala kal")) {
    time = "Tomorrow";
  } else if (query.includes("tonight") || query.includes("aaj raat") || query.includes("raat")) {
    time = "Tonight";
  } else if (query.includes("evening") || query.includes("shaam")) {
    time = priorContext.time && priorContext.time.includes("Tomorrow") ? "Tomorrow Evening" : "This Evening";
  } else if (query.includes("afternoon") || query.includes("dophar")) {
    time = priorContext.time && priorContext.time.includes("Tomorrow") ? "Tomorrow Afternoon" : "This Afternoon";
  } else if (query.includes("week") || query.includes("hafte")) {
    time = "This Week";
  } else if (priorContext.time) {
    time = priorContext.time;
  }

  // 2. Location extraction
  let location = null;
  const knownCities = ["jodhpur", "delhi", "mumbai", "jaipur", "london", "tokyo", "miami", "oslo", "cairo"];
  for (const c of knownCities) {
    if (query.includes(c)) {
      location = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }
  if (!location) {
    location = priorContext.location || "Current Location";
  }

  // 3. Intent & Topic detection
  let intentKey = "CURRENT_WEATHER";

  if (query.includes("rain") || query.includes("baarish") || query.includes("बारिश") || query.includes("वर्षा") || query.includes("umbrella") || query.includes("chhatri") || query.includes("barsaat") || query.includes("drizzle")) {
    intentKey = "RAIN";
  } else if (query.includes("hot") || query.includes("garmi") || query.includes("गर्मी") || query.includes("temperature") || query.includes("temp") || query.includes("taapmaan") || query.includes("तापमान") || query.includes("cold") || query.includes("thand") || query.includes("ठंड")) {
    intentKey = "TEMPERATURE";
  } else if (query.includes("wind") || query.includes("hawa") || query.includes("हवा") || query.includes("storm") || query.includes("gust") || query.includes("aandhi") || query.includes("तूफान")) {
    intentKey = "WIND";
  } else if (query.includes("kisan") || query.includes("किसान") || query.includes("farm") || query.includes("crop") || query.includes("fasal") || query.includes("फसल") || query.includes("irrigation") || query.includes("sinchai") || query.includes("सिंचाई")) {
    intentKey = "FARMING";
  } else if (query.includes("travel") || query.includes("flight") || query.includes("road") || query.includes("drive") || query.includes("safar") || query.includes("journey")) {
    intentKey = "TRAVEL";
  } else if (query.includes("outdoor") || query.includes("run") || query.includes("walk") || query.includes("cycle") || query.includes("match") || query.includes("cricket")) {
    intentKey = "OUTDOOR_ACTIVITY";
  } else if (query.includes("air") || query.includes("pollution") || query.includes("aqi") || query.includes("smog") || query.includes("hawa ki quality")) {
    intentKey = "AQI";
  } else if (query.includes("uv") || query.includes("sunscreen") || query.includes("dhoop")) {
    intentKey = "UV";
  } else if (query.includes("alert") || query.includes("warning") || query.includes("khatra") || query.includes("chetwani")) {
    intentKey = "ALERT";
  } else if (query.includes("forecast") || query.includes("next days") || query.includes("agla") || query.includes("hafta")) {
    intentKey = "FORECAST";
  } else if (query.includes("history") || query.includes("climate") || query.includes("annual") || query.includes("purana")) {
    intentKey = "HISTORICAL_WEATHER";
  } else if (priorContext.intent && (query.includes("what about") || query.includes("aur") || query.includes("and"))) {
    // Contextual follow-up inheritance
    intentKey = priorContext.intent;
  }

  const intentDef = INTENT_DEFINITIONS[intentKey] || INTENT_DEFINITIONS.CURRENT_WEATHER;

  return {
    location,
    time,
    intent: intentKey,
    intentLabel: intentDef.label,
    topic: intentDef.topic,
    status: "Analyzed"
  };
}

/**
 * Generates an AI response incorporating rich cards, intent metadata, and language
 */
export function generateAIChatResponse(userQuery, weatherData, lang = 'en', priorContext = {}) {
  const understanding = extractQueryUnderstanding(userQuery, priorContext);
  const city = weatherData?.location?.city || understanding.location || "your location";
  const temp = weatherData?.current?.temperature ?? 30;
  const condition = weatherData?.current?.condition || "Sunny";
  const rainProb = weatherData?.current?.rainProbability ?? 10;
  const humidity = weatherData?.current?.humidity ?? 45;
  const windSpeed = weatherData?.current?.windSpeed ?? 14;
  const aqi = weatherData?.current?.aqi ?? 85;
  const highTemp = weatherData?.current?.highTemp ?? (temp + 3);
  const lowTemp = weatherData?.current?.lowTemp ?? (temp - 7);

  let summaryText = "";
  let tip = "";
  let impact = "";

  // English, Hindi & Hinglish multilingual outputs
  if (understanding.intent === "RAIN") {
    if (lang === 'hi') {
      summaryText = rainProb > 40
        ? `${understanding.time} ${city} में ${rainProb}% बारिश की संभावना है। मौसम ${condition} बना रहेगा।`
        : `${city} में ${understanding.time} बारिश की संभावना केवल ${rainProb}% है। मौसम सूखा रहने का अनुमान है।`;
      tip = rainProb > 40 ? "बाहर निकलते समय छाता या रेनकोट साथ रखें!" : "बारिश की चिंता किए बिना योजना बना सकते हैं!";
      impact = rainProb > 40 ? "निचले इलाकों में हल्का जलभराव हो सकता है।" : "यातायात सामान्य रूप से चालू रहेगा।";
    } else if (lang === 'hinglish') {
      summaryText = rainProb > 40
        ? `Haan! ${understanding.time} ${city} mein ${rainProb}% rain chance hai with ${condition} conditions.`
        : `${city} mein ${understanding.time} baarish ka chance sirf ${rainProb}% hai. Mausam clear rahega.`;
      tip = rainProb > 40 ? "Umbrella ya raincoat sath rakhna achha rahega!" : "Koi umbrella ki zaroorat nahi hai!";
      impact = rainProb > 40 ? "Roads par paani bhar sakta hai, buffer time le kar chalein." : "Commute smooth rahega.";
    } else {
      summaryText = rainProb > 40
        ? `Yes, for ${understanding.time} in ${city}, there is a ${rainProb}% probability of rain with ${condition} skies.`
        : `Rain is unlikely for ${understanding.time} in ${city}. The probability of precipitation is only ${rainProb}%.`;
      tip = rainProb > 40 ? "Carrying a compact umbrella is recommended today!" : "No umbrella needed today; enjoy the pleasant weather!";
      impact = rainProb > 40 ? "Minor road splashing and slow peak-hour traffic expected." : "Dry road surfaces and normal transit.";
    }
  } else if (understanding.intent === "TEMPERATURE") {
    if (lang === 'hi') {
      summaryText = `${city} में वर्तमान तापमान ${temp}°C है। अधिकतम तापमान ${highTemp}°C और न्यूनतम ${lowTemp}°C तक जा सकता है।`;
      tip = "दोपहर के समय पर्याप्त पानी पिएं और धूप से बचें।";
      impact = temp > 35 ? "अधिक गर्मी के कारण हीट स्ट्रेस की संभावना।" : "सामान्य सुखद तापमान।";
    } else if (lang === 'hinglish') {
      summaryText = `Abhi ${city} mein temperature ${temp}°C hai. High ${highTemp}°C tak jaayega aur low ${lowTemp}°C rahega.`;
      tip = "Dophar 12 se 3 baje tak paani peete rahein aur dehydration se bachein.";
      impact = temp > 35 ? "High heat stress possible during peak hours." : "Pleasant temperature for travel.";
    } else {
      summaryText = `In ${city}, the temperature is currently ${temp}°C (${condition}). Expect a daytime high of ${highTemp}°C and a low of ${lowTemp}°C.`;
      tip = "Stay well hydrated and limit unshaded sun exposure during peak afternoon hours.";
      impact = temp > 35 ? "High thermal discomfort during peak midday sun." : "Comfortable thermal conditions.";
    }
  } else if (understanding.intent === "FARMING") {
    if (lang === 'hi') {
      summaryText = `${city} के किसानों के लिए: आर्द्रता ${humidity}% और हवा ${windSpeed} km/h है।`;
      tip = "वाष्पीकरण दर को ध्यान में रखते हुए सुबह के समय सिंचाई करें।";
      impact = "फसलों में नमी की निगरानी आवश्यक है।";
    } else if (lang === 'hinglish') {
      summaryText = `${city} ke farming context ke liye: Humidity ${humidity}% hai aur hawa ki speed ${windSpeed} km/h hai.`;
      tip = "Subah jaldi drip irrigation karein taaki paani ki bachat ho sake.";
      impact = "Mitti ki nami bachi rahegi.";
    } else {
      summaryText = `Agricultural advisory for ${city}: Relative humidity is ${humidity}% with winds at ${windSpeed} km/h.`;
      tip = "Irrigate early in the morning or late evening to minimize moisture evaporation loss.";
      impact = "Soil moisture remains stable under scheduled irrigation.";
    }
  } else {
    // General / Current Weather
    if (lang === 'hi') {
      summaryText = `${city} में इस समय तापमान ${temp}°C और स्थिति ${condition} है।`;
      tip = "मौसम सामान्य है, दिन की योजनाएं सुचारू रूप से बना सकते हैं।";
      impact = "सामान्य वायुमंडलीय स्थिति।";
    } else if (lang === 'hinglish') {
      summaryText = `${city} mein current mausam ${temp}°C aur ${condition} hai.`;
      tip = "Mausam stable hai, travel ya outdoor work aaraam se kar sakte hain.";
      impact = "Standard conditions.";
    } else {
      summaryText = `In ${city}, it is currently ${temp}°C with ${condition} skies. Highs will reach ${highTemp}°C and lows will drop to ${lowTemp}°C.`;
      tip = "Keep an eye on regional alerts if planning interstate travel.";
      impact = "Standard atmospheric baseline.";
    }
  }

  return {
    id: `msg-ai-${Date.now()}`,
    sender: "assistant",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: summaryText,
    understanding: understanding,
    richContent: {
      city,
      temp: `${temp}°C`,
      condition,
      rainProbability: `${rainProb}%`,
      humidity: `${humidity}%`,
      wind: `${windSpeed} km/h`,
      highLow: `${highTemp}°C / ${lowTemp}°C`,
      aqi: `${aqi}`,
      forecastWindow: understanding.time,
      tip,
      impact,
      recommendation: tip,
      confidence: weatherData?.confidence?.level || "High",
      uncertainty: weatherData?.confidence?.uncertaintyExplanation || "Atmospheric model stable.",
      sourcesUsed: [
        "Current Surface Telemetry",
        "Deterministic Forecast Model",
        "Regional Early Warning Feed"
      ],
      aiExplanationLabel: "WeatherGPT AI Explanation (Mock Data)"
    }
  };
}
