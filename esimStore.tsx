import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { getPlan } from './data';

export type EsimStatus = 'pending' | 'active' | 'expired';

export type PurchasedEsim = {
  id: string;
  planId: string;
  destinationId: string;
  purchasedAt: string;
  status: EsimStatus;
  iccid: string;
  activationCode: string;
  dataUsedGb: number;
};

type EsimStore = {
  esims: PurchasedEsim[];
  loading: boolean;
  purchaseEsim: (planId: string) => PurchasedEsim;
  activateEsim: (id: string) => void;
};

const STORAGE_KEY = 'takeflyt.esims.v1';

const EsimContext = createContext<EsimStore | null>(null);

function randomDigits(length: number): string {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += Math.floor(Math.random() * 10).toString();
  }
  return out;
}

function generateIccid(): string {
  return `8944${randomDigits(15)}`;
}

function generateActivationCode(destinationId: string): string {
  const token = randomDigits(10);
  return `LPA:1$smdp.takeflyt.com$${destinationId.toUpperCase()}-${token}`;
}

export function EsimProvider({ children }: { children: React.ReactNode }) {
  const [esims, setEsims] = useState<PurchasedEsim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setEsims(JSON.parse(raw));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(esims)).catch(() => {});
    }
  }, [esims, loading]);

  const value = useMemo<EsimStore>(
    () => ({
      esims,
      loading,
      purchaseEsim: (planId: string) => {
        const plan = getPlan(planId);
        if (!plan) throw new Error(`Unknown plan: ${planId}`);
        const esim: PurchasedEsim = {
          id: `${planId}-${Date.now()}`,
          planId,
          destinationId: plan.destinationId,
          purchasedAt: new Date().toISOString(),
          status: 'pending',
          iccid: generateIccid(),
          activationCode: generateActivationCode(plan.destinationId),
          dataUsedGb: 0,
        };
        setEsims((prev) => [esim, ...prev]);
        return esim;
      },
      activateEsim: (id: string) => {
        setEsims((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'active' } : e)));
      },
    }),
    [esims, loading]
  );

  return <EsimContext.Provider value={value}>{children}</EsimContext.Provider>;
}

export function useEsims(): EsimStore {
  const ctx = useContext(EsimContext);
  if (!ctx) throw new Error('useEsims must be used within an EsimProvider');
  return ctx;
}
