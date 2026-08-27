import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { ColorScheme, darkColors, lightColors } from './colors';

export type Scheme = 'light' | 'dark';

type ThemeStore = {
  scheme: Scheme;
  colors: ColorScheme;
  toggleScheme: () => void;
  loading: boolean;
};

const STORAGE_KEY = 'takeflyt.theme.v1';

const ThemeContext = createContext<ThemeStore | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [override, setOverride] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw === 'light' || raw === 'dark') setOverride(raw);
      })
      .finally(() => setLoading(false));
  }, []);

  const scheme: Scheme = override ?? (systemScheme === 'light' ? 'light' : 'dark');

  const value = useMemo<ThemeStore>(
    () => ({
      scheme,
      colors: scheme === 'light' ? lightColors : darkColors,
      loading,
      toggleScheme: () => {
        const next: Scheme = scheme === 'light' ? 'dark' : 'light';
        setOverride(next);
        AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
      },
    }),
    [scheme, loading]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeStore {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
