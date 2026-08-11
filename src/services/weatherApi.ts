export type PlaceResult = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  region?: string;
  country?: string;
  label: string;
};

export type WeatherSnapshot = {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  uvIndex: number;
  high: number;
  low: number;
  time: string;
};

export type HourlyForecastItem = {
  time: string;
  temperature: number;
  weatherCode: number;
};

export type DailyForecastItem = {
  date: string;
  high: number;
  low: number;
  weatherCode: number;
};

export type LocationWeather = {
  place: PlaceResult;
  current: WeatherSnapshot;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
};

type GeocodingResponse = {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    admin1?: string;
    country?: string;
    country_code?: string;
  }>;
};

type ForecastResponse = {
  current?: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    uv_index: number[];
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
};

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

function placeLabel(name: string, region?: string, country?: string): string {
  const parts = [name];
  if (region) parts.push(region);
  else if (country) parts.push(country);
  return parts.join(', ');
}

function toPlace(result: NonNullable<GeocodingResponse['results']>[number]): PlaceResult {
  return {
    id: String(result.id),
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    region: result.admin1,
    country: result.country,
    label: placeLabel(result.name, result.admin1, result.country),
  };
}

export async function searchPlaces(query: string, count = 6): Promise<PlaceResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url =
    `${GEOCODING_URL}?name=${encodeURIComponent(trimmed)}` +
    `&count=${count}&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Unable to search locations right now.');
  }

  const data = (await response.json()) as GeocodingResponse;
  return (data.results ?? []).map(toPlace);
}

export async function fetchWeatherForPlace(place: PlaceResult): Promise<LocationWeather> {
  const params = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,weather_code,uv_index',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: '7',
    wind_speed_unit: 'mph',
  });

  const response = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Unable to load weather data right now.');
  }

  const data = (await response.json()) as ForecastResponse;
  if (!data.current || !data.hourly || !data.daily) {
    throw new Error('Weather data was incomplete.');
  }

  const now = Date.now();
  let hourIndex = data.hourly.time.findIndex((t) => new Date(t).getTime() >= now);
  if (hourIndex < 0) hourIndex = 0;

  const hourly: HourlyForecastItem[] = data.hourly.time
    .slice(hourIndex, hourIndex + 12)
    .map((time, offset) => ({
      time,
      temperature: Math.round(data.hourly!.temperature_2m[hourIndex + offset]),
      weatherCode: data.hourly!.weather_code[hourIndex + offset],
    }));

  const daily: DailyForecastItem[] = data.daily.time.map((date, index) => ({
    date,
    high: Math.round(data.daily!.temperature_2m_max[index]),
    low: Math.round(data.daily!.temperature_2m_min[index]),
    weatherCode: data.daily!.weather_code[index],
  }));

  return {
    place,
    current: {
      temperature: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      humidity: Math.round(data.current.relative_humidity_2m),
      windSpeed: Math.round(data.current.wind_speed_10m),
      weatherCode: data.current.weather_code,
      uvIndex: data.hourly.uv_index[hourIndex] ?? 0,
      high: daily[0]?.high ?? Math.round(data.current.temperature_2m),
      low: daily[0]?.low ?? Math.round(data.current.temperature_2m),
      time: data.current.time,
    },
    hourly,
    daily,
  };
}
