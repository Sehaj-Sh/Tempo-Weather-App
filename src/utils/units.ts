import type { TemperatureUnit, WindSpeedUnit } from '@/storage/appStorage';

/** API temps are Celsius. */
export function convertTemperature(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'f') return Math.round((celsius * 9) / 5 + 32);
  return Math.round(celsius);
}

export function temperatureSymbol(unit: TemperatureUnit): string {
  return unit === 'f' ? '°F' : '°C';
}

/** API wind is requested in mph. */
export function convertWindSpeed(mph: number, unit: WindSpeedUnit): number {
  if (unit === 'kmh') return Math.round(mph * 1.60934);
  return Math.round(mph);
}

export function windSpeedLabel(unit: WindSpeedUnit): string {
  return unit === 'kmh' ? 'km/h' : 'mph';
}

export function formatTemp(celsius: number, unit: TemperatureUnit): string {
  return `${convertTemperature(celsius, unit)}°`;
}
