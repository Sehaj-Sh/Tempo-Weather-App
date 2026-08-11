import * as Location from 'expo-location';
import type { PlaceResult } from '@/services/weatherApi';

export type DeviceLocationResult =
  | { ok: true; place: PlaceResult }
  | { ok: false; reason: 'denied' | 'unavailable' | 'error'; message: string };

function buildPlaceFromCoords(
  latitude: number,
  longitude: number,
  geo?: Location.LocationGeocodedAddress | null
): PlaceResult {
  const name = geo?.city || geo?.subregion || geo?.region || 'Current location';
  const region = geo?.region || geo?.subregion || undefined;
  const country = geo?.country || undefined;

  return {
    id: `gps-${latitude.toFixed(3)},${longitude.toFixed(3)}`,
    name: name ?? 'Current location',
    latitude,
    longitude,
    region: region ?? undefined,
    country: country ?? undefined,
    label: region ? `${name}, ${region}` : (name ?? 'Current location'),
  };
}

export async function getDevicePlace(): Promise<DeviceLocationResult> {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) {
      return {
        ok: false,
        reason: 'denied',
        message: 'Location permission is required to show weather near you.',
      };
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = position.coords;
    let geo: Location.LocationGeocodedAddress | null = null;

    try {
      const results = await Location.reverseGeocodeAsync({ latitude, longitude });
      geo = results[0] ?? null;
    } catch {
      // Coordinates alone are enough to fetch weather.
    }

    return {
      ok: true,
      place: buildPlaceFromCoords(latitude, longitude, geo),
    };
  } catch {
    return {
      ok: false,
      reason: 'error',
      message: 'Could not determine your current location.',
    };
  }
}
