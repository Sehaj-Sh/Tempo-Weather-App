# Tempo Weather App

Tempo is a mobile weather app built with **Expo (SDK 57)** and **React Native**.  
It shows live weather for your current location, lets you search and save cities, and stores user preferences and accounts locally on the device.

---

## Features

- **Current weather** — temperature, condition, feels like, humidity, UV, wind, and hourly forecast
- **7-day forecast** — daily high/low and conditions
- **GPS location** — requests permission and loads weather for your current place
- **City search** — search any place with live suggestions
- **Saved cities** — add, select, and delete cities (stored on device)
- **Local login / signup** — create an account, log in, see your name, and sign out
- **Settings**
  - Temperature unit: °C / °F
  - Wind unit: mph / km/h
  - Appearance: Light, Dark, or Custom color
- **Weather cache** — recent weather is saved locally to reduce repeat API calls

---

## Tech Stack

| Area        | Technology                                          |
| ----------- | --------------------------------------------------- | ---------------------------- |
| Framework   | Expo SDK 57 + React Native                          |
| Language    | TypeScript                                          |
| Navigation  | Expo Router + custom bottom tabs                    |
| Storage     | AsyncStorage                                        |
| Location    | `expo-location`                                     |
| Weather API | [Open-Meteo](🌤️ Free Open-Source Weather API        | Open-Meteo.com) (no API key) |
| Geocoding   | Open-Meteo Geocoding API + device reverse geocoding |

---

## How the App Works

### 1. App startup

1. Providers load saved settings (appearance, units, auth session, weather cache).
2. The app asks for location permission.
3. If allowed, it gets GPS coordinates, resolves a city name, and fetches weather from Open-Meteo.
4. If cached weather is still fresh (about 15 minutes), it is shown first.

### 2. Main screens

| Tab          | What it does                                              |
| ------------ | --------------------------------------------------------- |
| **Current**  | Live conditions + hourly forecast for the active location |
| **Forecast** | 7-day outlook for the active location                     |
| **Search**   | Search places, view current location, manage saved cities |
| **Settings** | Account, units, and appearance                            |

### 3. Weather data flow

```
GPS / Search / Saved city
        ↓
  Place (lat, lon, name)
        ↓
  Open-Meteo Forecast API
        ↓
  WeatherContext (shared app state)
        ↓
  Current / Forecast / Search screens
```

### 4. Authentication (local only)

- **Sign up** stores name, email, and password in AsyncStorage, then returns to the login screen.
- **Log in** checks the stored users list. If email and password match, a session is saved.
- **Settings** shows the user’s name when logged in, and a **Sign Out** option.
- This is device-local auth (not a real backend). Suitable for demo / class project use.

### 5. Settings persistence

All of these are saved with AsyncStorage and applied across the app:

- Appearance mode / custom color
- Temperature and wind units
- Saved cities
- Weather cache
- User accounts and login session

---

## Project Structure

```
Tempo-Weather-App/
├── app.json                 # Expo config (location permissions, splash, icons)
├── package.json
├── assets/                  # App icons, splash, logo
└── src/
    ├── app/
    │   ├── _layout.tsx      # Root providers + stack
    │   └── index.tsx        # Main shell (tabs + screens)
    ├── components/          # Shared UI (Header, BottomNav, modals, cards)
    ├── screens/             # Current, Forecast, Search, Settings, Auth
    ├── context/             # App state providers
    │   ├── WeatherContext.tsx
    │   ├── AppearanceContext.tsx
    │   ├── PreferencesContext.tsx
    │   └── AuthContext.tsx
    ├── services/
    │   ├── weatherApi.ts    # Open-Meteo weather + place search
    │   └── location.ts      # GPS + reverse geocoding
    ├── storage/
    │   ├── appStorage.ts    # AsyncStorage read/write helpers
    │   └── keys.ts          # Storage key names
    ├── constants/           # Theme + appearance helpers
    └── utils/               # Weather codes + unit conversion
```

---

## Getting Started

### Requirements

- Node.js installed
- Expo Go app (recommended for phone testing), **or** an iOS Simulator / Android Emulator

### Install and run

```bash
npm install
npx expo start
```

Then:

- scan the QR code with **Expo Go**, or
- press `i` for iOS simulator, `a` for Android emulator, `w` for web

### Location note

Allow location access when prompted so Current and Forecast can load weather for your real position.  
If permission is denied, you can still search cities manually.

---

## External APIs

### Open-Meteo Forecast

- Used for current, hourly, and daily weather
- Example: `https://api.open-meteo.com/v1/forecast?...`

### Open-Meteo Geocoding

- Used for city search suggestions
- Example: `https://geocoding-api.open-meteo.com/v1/search?name=Calgary`

No API keys are required for these free endpoints.

---

## Testing Checklist (for instructors)

1. Open the app and allow location → Current/Forecast show local weather.
2. Search a city → select it → Current updates.
3. Add a city → it appears first in Saved cities.
4. Edit → delete a saved city.
5. Settings → switch °C/°F and mph/km/h → values update on weather screens.
6. Change appearance → background and button colors update.
7. Sign up → redirected to login → log in → name appears in Settings → Sign Out works.

---

## License

See [LICENSE](./LICENSE).
