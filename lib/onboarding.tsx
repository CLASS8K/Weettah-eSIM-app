import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'weettah.onboarding.completed.v1';

type OnboardingStore = {
  /** null while the persisted flag is still loading. */
  completed: boolean | null;
  markComplete: () => void;
};

const OnboardingContext = createContext<OnboardingStore | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => setCompleted(raw === 'true'));
  }, []);

  const value = useMemo<OnboardingStore>(
    () => ({
      completed,
      markComplete: () => {
        setCompleted(true);
        AsyncStorage.setItem(STORAGE_KEY, 'true').catch(() => {});
      },
    }),
    [completed]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingStore {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within an OnboardingProvider');
  return ctx;
}
