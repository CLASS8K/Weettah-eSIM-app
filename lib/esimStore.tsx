import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { getDestination, getPlan, Plan } from './data';
import { cancelDepartureReminder, scheduleDepartureReminder } from './notifications';

export type EsimStatus = 'pending' | 'active' | 'expired';

export type PurchasedEsim = {
  id: string;
  planId: string;
  destinationId: string;
  purchasedAt: string;
  activatedAt: string | null;
  status: EsimStatus;
  iccid: string;
  activationCode: string;
  dataUsedGb: number;
  /** ISO date string for when the traveler expects to depart, if they gave one at purchase. */
  departureDate: string | null;
  /** id of the scheduled local reminder notification, if one was scheduled. */
  reminderNotificationId: string | null;
};

type EsimStore = {
  esims: PurchasedEsim[];
  loading: boolean;
  landedDestinationId: string | null;
  purchaseEsim: (planId: string, departureDate?: Date) => PurchasedEsim;
  activateEsim: (id: string) => void;
  clearLanded: () => void;
};

const ESIMS_STORAGE_KEY = 'weettah.esims.v1';
const LANDED_STORAGE_KEY = 'weettah.landed.v1';

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
  return `LPA:1$smdp.weettah.com$${destinationId.toUpperCase()}-${token}`;
}

/** Deterministic 0..1 value derived from an id, so usage pacing is stable across renders. */
function seededRatio(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return (hash % 1000) / 1000;
}

/** Simulates gradual data usage since activation, since there's no real network to meter. */
export function getSimulatedDataUsedGb(esim: PurchasedEsim, plan: Plan): number {
  if (esim.status !== 'active' || !esim.activatedAt) return esim.dataUsedGb;
  const elapsedDays = (Date.now() - new Date(esim.activatedAt).getTime()) / (1000 * 60 * 60 * 24);
  const pace = 0.65 + seededRatio(esim.id) * 0.3; // varies 65%-95% pacing between travelers
  const fractionOfValidity = Math.min(Math.max(elapsedDays, 0) / plan.validityDays, 1);
  return Math.min(fractionOfValidity * pace * plan.dataAmountGb, plan.dataAmountGb);
}

export function EsimProvider({ children }: { children: React.ReactNode }) {
  const [esims, setEsims] = useState<PurchasedEsim[]>([]);
  const [landedDestinationId, setLandedDestinationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(ESIMS_STORAGE_KEY), AsyncStorage.getItem(LANDED_STORAGE_KEY)])
      .then(([rawEsims, rawLanded]) => {
        if (rawEsims) setEsims(JSON.parse(rawEsims));
        if (rawLanded) setLandedDestinationId(rawLanded);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(ESIMS_STORAGE_KEY, JSON.stringify(esims)).catch(() => {});
    }
  }, [esims, loading]);

  useEffect(() => {
    if (!loading) {
      if (landedDestinationId) {
        AsyncStorage.setItem(LANDED_STORAGE_KEY, landedDestinationId).catch(() => {});
      } else {
        AsyncStorage.removeItem(LANDED_STORAGE_KEY).catch(() => {});
      }
    }
  }, [landedDestinationId, loading]);

  const value = useMemo<EsimStore>(
    () => ({
      esims,
      loading,
      landedDestinationId,
      purchaseEsim: (planId: string, departureDate?: Date) => {
        const plan = getPlan(planId);
        if (!plan) throw new Error(`Unknown plan: ${planId}`);
        const esim: PurchasedEsim = {
          id: `${planId}-${Date.now()}`,
          planId,
          destinationId: plan.destinationId,
          purchasedAt: new Date().toISOString(),
          activatedAt: null,
          status: 'pending',
          iccid: generateIccid(),
          activationCode: generateActivationCode(plan.destinationId),
          dataUsedGb: 0,
          departureDate: departureDate ? departureDate.toISOString() : null,
          reminderNotificationId: null,
        };
        setEsims((prev) => [esim, ...prev]);

        // Fire-and-forget: don't block the purchase (or a permission prompt) on this.
        if (departureDate) {
          const destination = getDestination(plan.destinationId);
          scheduleDepartureReminder({ destinationName: destination?.name ?? 'trip', departureDate }).then(
            (notificationId) => {
              if (notificationId) {
                setEsims((prev) =>
                  prev.map((e) => (e.id === esim.id ? { ...e, reminderNotificationId: notificationId } : e))
                );
              }
            }
          );
        }

        return esim;
      },
      activateEsim: (id: string) => {
        setEsims((prev) => {
          const esim = prev.find((e) => e.id === id);
          if (esim) {
            setLandedDestinationId(esim.destinationId);
            if (esim.reminderNotificationId) {
              cancelDepartureReminder(esim.reminderNotificationId);
            }
          }
          return prev.map((e) =>
            e.id === id
              ? { ...e, status: 'active', activatedAt: new Date().toISOString(), reminderNotificationId: null }
              : e
          );
        });
      },
      clearLanded: () => setLandedDestinationId(null),
    }),
    [esims, loading, landedDestinationId]
  );

  return <EsimContext.Provider value={value}>{children}</EsimContext.Provider>;
}

export function useEsims(): EsimStore {
  const ctx = useContext(EsimContext);
  if (!ctx) throw new Error('useEsims must be used within an EsimProvider');
  return ctx;
}
