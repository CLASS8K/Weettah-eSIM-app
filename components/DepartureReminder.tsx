import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Destination } from '../lib/data';
import { PurchasedEsim } from '../lib/esimStore';
import { ColorScheme, radius, spacing } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

export function DepartureReminder({ esim, destination }: { esim: PurchasedEsim; destination: Destination }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const router = useRouter();

  return (
    <Pressable style={styles.banner} onPress={() => router.push(`/esim/${esim.id}`)}>
      <Text style={styles.icon}>✈️</Text>
      <View style={styles.textCol}>
        <Text style={styles.title}>Don't forget to install</Text>
        <Text style={styles.body}>
          Your {destination.flag} {destination.name} eSIM is ready — install it before you depart so it's live the
          moment you land.
          {esim.reminderNotificationId
            ? " We've also scheduled a reminder for you."
            : ''}
        </Text>
      </View>
    </Pressable>
  );
}

function getStyles(colors: ColorScheme) {
  return StyleSheet.create({
    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.warning,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    icon: {
      fontSize: 24,
    },
    textCol: {
      flex: 1,
    },
    title: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 2,
    },
    body: {
      color: colors.textMuted,
      fontSize: 12,
      lineHeight: 17,
    },
  });
}
