import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const REMINDER_LEAD_HOURS = 24;

/** Local scheduled notifications aren't supported on the web target. */
function isSupportedPlatform(): boolean {
  return Platform.OS !== 'web';
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isSupportedPlatform()) return false;
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.status === 'granted') return true;
    const requested = await Notifications.requestPermissionsAsync();
    return requested.status === 'granted';
  } catch {
    return false;
  }
}

/**
 * Schedules a local notification REMINDER_LEAD_HOURS before the given departure date.
 * Returns the notification id (for later cancellation), or null if it couldn't be scheduled
 * (unsupported platform, permission denied, or the departure is already inside the lead window).
 */
export async function scheduleDepartureReminder(params: {
  destinationName: string;
  departureDate: Date;
}): Promise<string | null> {
  if (!isSupportedPlatform()) return null;

  const reminderTime = new Date(params.departureDate.getTime() - REMINDER_LEAD_HOURS * 60 * 60 * 1000);
  const secondsUntil = Math.floor((reminderTime.getTime() - Date.now()) / 1000);
  if (secondsUntil <= 0) return null;

  try {
    const granted = await requestNotificationPermission();
    if (!granted) return null;
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: `Don't forget your ${params.destinationName} eSIM`,
        body: "You depart soon — install it now so it's ready the moment you land.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntil,
        repeats: false,
      },
    });
  } catch {
    return null;
  }
}

export async function cancelDepartureReminder(notificationId: string | null): Promise<void> {
  if (!notificationId || !isSupportedPlatform()) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // Nothing to do if it already fired or was already cancelled.
  }
}
