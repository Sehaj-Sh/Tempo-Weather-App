import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getDevicePlace } from '@/services/location';
import {
  fetchWeatherForPlace,
  LocationWeather,
  PlaceResult,
  searchPlaces,
} from '@/services/weatherApi';
import {
  isWeatherCacheFresh,
  loadSavedCities,
  loadWeatherCache,
  saveSavedCities,
  saveWeatherCache,
  SavedCity,
  WEATHER_CACHE_TTL_MS,
  WeatherCache,
} from '@/storage/appStorage';

type WeatherContextValue = {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  devicePlace: PlaceResult | null;
  deviceWeather: LocationWeather | null;
  activeWeather: LocationWeather | null;
  isViewingDeviceLocation: boolean;
  savedCities: SavedCity[];
  savedWeatherById: Record<string, LocationWeather>;
  selectPlace: (place: PlaceResult) => Promise<void>;
  selectSavedCity: (city: SavedCity) => Promise<void>;
  useDeviceLocation: () => Promise<void>;
  returnToDeviceLocation: () => Promise<void>;
  addSavedCity: (place: PlaceResult) => Promise<void>;
  removeSavedCity: (id: string) => Promise<void>;
  searchCitySuggestions: (query: string) => Promise<PlaceResult[]>;
  refresh: () => Promise<void>;
};

const WeatherContext = createContext<WeatherContextValue | null>(null);

function toSavedCity(place: PlaceResult): SavedCity {
  return {
    id: place.id,
    name: place.name,
    latitude: place.latitude,
    longitude: place.longitude,
    region: place.region,
    country: place.country,
  };
}

function toPlace(city: SavedCity): PlaceResult {
  return {
    id: city.id,
    name: city.name,
    latitude: city.latitude,
    longitude: city.longitude,
    region: city.region,
    country: city.country,
    label: city.region ? `${city.name}, ${city.region}` : city.name,
  };
}

function placesMatch(a: PlaceResult | null | undefined, b: PlaceResult | null | undefined) {
  if (!a || !b) return false;
  return (
    Math.abs(a.latitude - b.latitude) < 0.05 && Math.abs(a.longitude - b.longitude) < 0.05
  );
}

async function loadWeatherMap(cities: SavedCity[]): Promise<Record<string, LocationWeather>> {
  const entries = await Promise.all(
    cities.map(async (city) => {
      try {
        const weather = await fetchWeatherForPlace(toPlace(city));
        return [city.id, weather] as const;
      } catch {
        return null;
      }
    })
  );

  const map: Record<string, LocationWeather> = {};
  for (const entry of entries) {
    if (entry) map[entry[0]] = entry[1];
  }
  return map;
}

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [devicePlace, setDevicePlace] = useState<PlaceResult | null>(null);
  const [deviceWeather, setDeviceWeather] = useState<LocationWeather | null>(null);
  const [activeWeather, setActiveWeather] = useState<LocationWeather | null>(null);
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const [savedWeatherById, setSavedWeatherById] = useState<Record<string, LocationWeather>>({});
  const persistEnabled = useRef(false);
  const cacheUpdatedAt = useRef(0);

  const persistCache = useCallback(
    async (next: {
      devicePlace: PlaceResult | null;
      deviceWeather: LocationWeather | null;
      activeWeather: LocationWeather | null;
      savedWeatherById: Record<string, LocationWeather>;
    }) => {
      const updatedAt = Date.now();
      cacheUpdatedAt.current = updatedAt;
      const cache: WeatherCache = {
        updatedAt,
        devicePlace: next.devicePlace,
        deviceWeather: next.deviceWeather,
        activeWeather: next.activeWeather,
        savedWeatherById: next.savedWeatherById,
      };
      await saveWeatherCache(cache);
    },
    []
  );

  const hydrate = useCallback(async (forceNetwork = false) => {
    setError(null);

    try {
      const [cities, cache] = await Promise.all([loadSavedCities(), loadWeatherCache()]);
      setSavedCities(cities);

      const hasFreshCache = !forceNetwork && isWeatherCacheFresh(cache) && !!cache?.activeWeather;

      if (cache?.activeWeather) {
        cacheUpdatedAt.current = cache.updatedAt;
        setDevicePlace(cache.devicePlace);
        setDeviceWeather(cache.deviceWeather);
        setActiveWeather(cache.activeWeather);
        setSavedWeatherById(cache.savedWeatherById);
        setIsReady(true);
        setIsLoading(false);
        persistEnabled.current = true;

        if (hasFreshCache) {
          return;
        }
      } else {
        setIsLoading(true);
      }

      const device = await getDevicePlace();
      let nextPlace: PlaceResult | null = null;
      let nextDevicePlace: PlaceResult | null = null;

      if (device.ok) {
        nextPlace = device.place;
        nextDevicePlace = device.place;
        setDevicePlace(device.place);
      } else {
        setDevicePlace(null);
        setDeviceWeather(null);
        setError(device.message);
        if (cities[0]) {
          nextPlace = toPlace(cities[0]);
        } else if (cache?.activeWeather) {
          // Keep showing cached weather if GPS fails.
          return;
        }
      }

      if (!nextPlace) {
        if (!cache?.activeWeather) {
          setActiveWeather(null);
          setSavedWeatherById({});
        }
        return;
      }

      const [weather, weatherMap] = await Promise.all([
        fetchWeatherForPlace(nextPlace),
        loadWeatherMap(cities),
      ]);

      const nextDeviceWeather = device.ok ? weather : null;
      if (device.ok) {
        setDeviceWeather(weather);
        setError(null);
      }

      setActiveWeather(weather);
      setSavedWeatherById(weatherMap);

      await persistCache({
        devicePlace: nextDevicePlace,
        deviceWeather: nextDeviceWeather,
        activeWeather: weather,
        savedWeatherById: weatherMap,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load weather.');
    } finally {
      setIsLoading(false);
      setIsReady(true);
      persistEnabled.current = true;
    }
  }, [persistCache]);

  useEffect(() => {
    void hydrate(false);
  }, [hydrate]);

  useEffect(() => {
    if (!isReady) return;
    void saveSavedCities(savedCities);
  }, [savedCities, isReady]);

  useEffect(() => {
    if (!persistEnabled.current || !isReady) return;
    void persistCache({
      devicePlace,
      deviceWeather,
      activeWeather,
      savedWeatherById,
    });
  }, [
    devicePlace,
    deviceWeather,
    activeWeather,
    savedWeatherById,
    isReady,
    persistCache,
  ]);

  const selectPlace = useCallback(async (place: PlaceResult) => {
    setIsLoading(true);
    setError(null);
    try {
      const weather = await fetchWeatherForPlace(place);
      setActiveWeather(weather);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load weather.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectSavedCity = useCallback(
    async (city: SavedCity) => {
      const cached = savedWeatherById[city.id];
      if (cached) {
        setActiveWeather(cached);
        return;
      }
      await selectPlace(toPlace(city));
    },
    [savedWeatherById, selectPlace]
  );

  const useDeviceLocation = useCallback(async () => {
    const cacheIsFresh = Date.now() - cacheUpdatedAt.current < WEATHER_CACHE_TTL_MS;

    if (deviceWeather && cacheIsFresh) {
      setActiveWeather(deviceWeather);
      setError(null);
      return;
    }

    if (deviceWeather) {
      setActiveWeather(deviceWeather);
    }

    setIsLoading(!deviceWeather);
    setError(null);
    try {
      const device = await getDevicePlace();
      if (!device.ok) {
        setError(device.message);
        return;
      }
      setDevicePlace(device.place);
      const weather = await fetchWeatherForPlace(device.place);
      setDeviceWeather(weather);
      setActiveWeather(weather);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load weather.');
    } finally {
      setIsLoading(false);
    }
  }, [deviceWeather]);

  const returnToDeviceLocation = useCallback(async () => {
    if (deviceWeather) {
      setActiveWeather(deviceWeather);
      setError(null);
      return;
    }
    await useDeviceLocation();
  }, [deviceWeather, useDeviceLocation]);

  const addSavedCity = useCallback(async (place: PlaceResult) => {
    const city = toSavedCity(place);
    setSavedCities((prev) => {
      const without = prev.filter((item) => item.id !== city.id);
      return [city, ...without];
    });

    try {
      const weather = await fetchWeatherForPlace(place);
      setSavedWeatherById((prev) => ({ ...prev, [city.id]: weather }));
      setActiveWeather(weather);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load weather for that city.');
    }
  }, []);

  const removeSavedCity = useCallback(async (id: string) => {
    setSavedCities((prev) => prev.filter((city) => city.id !== id));
    setSavedWeatherById((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const searchCitySuggestions = useCallback(async (query: string) => {
    return searchPlaces(query);
  }, []);

  const isViewingDeviceLocation = placesMatch(activeWeather?.place, devicePlace);

  const value = useMemo(
    () => ({
      isReady,
      isLoading,
      error,
      devicePlace,
      deviceWeather,
      activeWeather,
      isViewingDeviceLocation,
      savedCities,
      savedWeatherById,
      selectPlace,
      selectSavedCity,
      useDeviceLocation,
      returnToDeviceLocation,
      addSavedCity,
      removeSavedCity,
      searchCitySuggestions,
      refresh: () => hydrate(true),
    }),
    [
      isReady,
      isLoading,
      error,
      devicePlace,
      deviceWeather,
      activeWeather,
      isViewingDeviceLocation,
      savedCities,
      savedWeatherById,
      selectPlace,
      selectSavedCity,
      useDeviceLocation,
      returnToDeviceLocation,
      addSavedCity,
      removeSavedCity,
      searchCitySuggestions,
      hydrate,
    ]
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) {
    throw new Error('useWeather must be used within WeatherProvider');
  }
  return ctx;
}
