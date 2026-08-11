import * as Location from 'expo-location';
import type { PlaceResult } from '@/services/weatherApi';

export type DeviceLocationResult =
  | { ok: true; place: PlaceResult }
  | { ok: false; reason: 'denied' | 'unavailable' | 'error'; message: string };

type ReverseGeoName = {
  name: string;
  region?: string;
  country?: string;
};

function buildPlace(
  latitude: number,
  longitude: number,
  resolved: ReverseGeoName
): PlaceResult {
  const { name, region, country } = resolved;
  const labelParts = [name];
  if (region && region !== name) labelParts.push(region);
  else if (country && country !== name) labelParts.push(country);

  return {
    id: `gps-${latitude.toFixed(3)},${longitude.toFixed(3)}`,
    name,
    latitude,
    longitude,
    region,
    country,
    label: labelParts.join(', '),
  };
}

function fromExpoGeo(geo: Location.LocationGeocodedAddress): ReverseGeoName | null {
  const name =
    geo.city ||
    geo.district ||
    geo.subregion ||
    geo.name ||
    geo.street ||
    undefined;
  const region = geo.region || geo.subregion || undefined;
  const country = geo.country || undefined;

  if (!name && !region) return null;

  return {
    name: name || region || 'Current location',
    region: name ? region : undefined,
    country,
  };
}

async function reverseGeocodeRemote(
  latitude: number,
  longitude: number
): Promise<ReverseGeoName | null> {
  try {
    const url =
      `https://api.bigdatacloud.net/data/reverse-geocode-client` +
      `?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = (await response.json()) as {
      city?: string;
      locality?: string;
      principalSubdivision?: string;
      countryName?: string;
    };

    const name = data.city || data.locality;
    const region = data.principalSubdivision;
    const country = data.countryName;

    if (!name && !region) return null;

    return {
      name: name || region || 'Current location',
      region: name ? region : undefined,
      country,
    };
  } catch {
    return null;
  }
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
    let resolved: ReverseGeoName | null = null;

    try {
      const results = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (results[0]) {
        resolved = fromExpoGeo(results[0]);
      }
    } catch {
      // Fall through to remote reverse geocode.
    }

    if (!resolved || resolved.name === 'Current location') {
      resolved = (await reverseGeocodeRemote(latitude, longitude)) ?? resolved;
    }

    return {
      ok: true,
      place: buildPlace(
        latitude,
        longitude,
        resolved ?? { name: 'Current location' }
      ),
    };
  } catch {
    return {
      ok: false,
      reason: 'error',
      message: 'Could not determine your current location.',
    };
  }
}
