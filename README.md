# Weettah

A cross-platform (iOS + Android) mobile app for browsing and buying travel eSIMs, built with [Expo](https://expo.dev) + React Native + TypeScript.

## Features (MVP)

- **Explore** — search and browse eSIM data plans by destination (country/region)
- **Plan details** — data amount, validity, network type, coverage, and price
- **Checkout** — mock payment flow (swap in a real payment provider before launch)
- **My eSIMs** — purchased eSIMs with install status, persisted on-device
- **Install flow** — QR code + activation string (LPA format) for eSIM installation, with a "simulate install" action for demoing without a real device profile
- **Account** — profile summary and settings menu shell

All data (destinations, plans, purchases) is currently mocked in `lib/data.ts` and `lib/esimStore.tsx` so the app is fully runnable without a backend.

## Tech stack

- [Expo](https://expo.dev) SDK 57 (React Native 0.86, React 19)
- [expo-router](https://docs.expo.dev/router/introduction/) for file-based navigation
- TypeScript (strict mode)
- `react-native-qrcode-svg` for eSIM activation QR codes
- `@react-native-async-storage/async-storage` for local persistence

## Getting started

```bash
npm install
npm run ios       # or: npm run android / npm run web
```

Requires the [Expo Go](https://expo.dev/go) app for quick device testing, or Xcode/Android Studio for simulators.

## Project structure

```
app/
  _layout.tsx           Root stack (wraps app in providers, defines modal/stack screens)
  (tabs)/                Bottom tab navigator
    index.tsx             Explore / destination search
    my-esims.tsx           Purchased eSIMs list
    account.tsx             Account screen
  destination/[id].tsx    Plans available for a destination
  plan/[id].tsx           Plan details + buy CTA
  checkout/[id].tsx       Mock checkout / payment
  esim/[id].tsx           eSIM detail, QR install, usage stats
components/              Reusable UI (buttons, cards, status pill)
lib/
  data.ts                 Mock destinations & plans catalog
  esimStore.tsx            Purchased-eSIM state (Context + AsyncStorage)
theme/colors.ts           Design tokens (colors, spacing, radius)
```

## Next steps toward production

- [ ] Real eSIM provisioning via a provider API (e.g. an eSIM aggregator/MNO partner) instead of mock QR/activation codes
- [ ] Real payment provider (Stripe, RevenueCat, etc.) in `app/checkout/[id].tsx`
- [ ] User authentication and account sync (currently local-only, unauthenticated)
- [ ] Push notifications for low-data / plan-expiry alerts
- [ ] Replace default Expo placeholder icons/splash in `assets/` with Weettah branding
- [ ] Error/loading states and retry handling once network calls are introduced
- [ ] Analytics and crash reporting
