import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Destination } from '../lib/data';
import { ColorScheme, radius, spacing } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

export function LandedBanner({ destination, onDismiss }: { destination: Destination; onDismiss: () => void }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [primaryFlagColor, secondaryFlagColor] = destination.flagColors;

  return (
    <View style={[styles.banner, { backgroundColor: primaryFlagColor }]}>
      <View style={[styles.stripe, { backgroundColor: secondaryFlagColor }]} />
      <View style={styles.row}>
        <Text style={styles.flag}>{destination.flag}</Text>
        <View style={styles.textCol}>
          <Text style={styles.salutation}>
            {destination.salutation} <Text style={styles.wave}>👋</Text>
          </Text>
          <Text style={styles.welcome}>Welcome to {destination.name}</Text>
        </View>
        <Pressable onPress={onDismiss} hitSlop={12} style={styles.dismiss}>
          <Text style={styles.dismissText}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
}

function getStyles(colors: ColorScheme) {
  return StyleSheet.create({
    banner: {
      borderRadius: radius.lg,
      marginBottom: spacing.lg,
      overflow: 'hidden',
    },
    stripe: {
      height: 5,
      width: '100%',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      gap: spacing.md,
    },
    flag: {
      fontSize: 32,
    },
    textCol: {
      flex: 1,
    },
    salutation: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '800',
    },
    wave: {
      fontSize: 15,
    },
    welcome: {
      color: 'rgba(255, 255, 255, 0.85)',
      fontSize: 13,
      marginTop: 2,
    },
    dismiss: {
      padding: spacing.xs,
    },
    dismissText: {
      color: 'rgba(255, 255, 255, 0.85)',
      fontSize: 16,
      fontWeight: '700',
    },
  });
}
