import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

/** WMO weather interpretation codes used by Open-Meteo. */
export function getWeatherLabel(code: number): string {
  if (code === 0) return 'Clear';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Cloudy';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 57) return 'Drizzle';
  if (code >= 61 && code <= 67) return 'Rainy';
  if (code >= 71 && code <= 77) return 'Snowy';
  if (code >= 80 && code <= 82) return 'Showers';
  if (code === 85 || code === 86) return 'Snow showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Cloudy';
}

export function getWeatherIcon(code: number): LucideIcon {
  if (code === 0 || code === 1) return Sun;
  if (code === 45 || code === 48) return CloudFog;
  if (code >= 51 && code <= 67) return CloudRain;
  if (code >= 71 && code <= 77) return CloudSnow;
  if (code >= 80 && code <= 82) return CloudRain;
  if (code === 85 || code === 86) return CloudSnow;
  if (code >= 95) return CloudLightning;
  return Cloud;
}

export function getUvLabel(uv: number): { label: string; level: string } {
  if (uv < 3) return { label: 'Low', level: `Level ${Math.round(uv)}` };
  if (uv < 6) return { label: 'Moderate', level: `Level ${Math.round(uv)}` };
  if (uv < 8) return { label: 'High', level: `Level ${Math.round(uv)}` };
  if (uv < 11) return { label: 'Very high', level: `Level ${Math.round(uv)}` };
  return { label: 'Extreme', level: `Level ${Math.round(uv)}` };
}

export function formatHourLabel(isoTime: string, index: number): string {
  if (index === 0) return 'Now';
  const date = new Date(isoTime);
  const hours = date.getHours();
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}${suffix}`;
}

export function formatDayLabel(isoDate: string, index: number): string {
  if (index === 0) return 'Today';
  const date = new Date(`${isoDate}T12:00:00`);
  return date.toLocaleDateString(undefined, { weekday: 'long' });
}

export function formatLocalTime(isoTime?: string): string {
  const date = isoTime ? new Date(isoTime) : new Date();
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
