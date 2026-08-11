# Tempo Weather App

Expo (SDK 57) weather app using [Expo Router](https://docs.expo.dev/router/introduction/).

## Project structure

```
assets/                 # images, icons, splash
src/
  app/                  # Expo Router routes
  components/           # shared UI (Header, BottomNav, cards, logo)
  screens/              # screen views (Current, Forecast, Search, Settings, Auth)
  constants/            # theme tokens (colors, fonts, radii)
app.json
package.json
```

## Get started

```bash
npm install
npx expo start
```

Then open in a development build, Android emulator, iOS simulator, or Expo Go.
