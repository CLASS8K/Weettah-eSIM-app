import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Destination, getPlansForDestination } from '../lib/data';
import { ColorScheme, radius, spacing } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

export function DestinationCard({ destination }: { destination: Destination }) {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const cheapest = getPlansForDestination(destination.id)[0];

  return (
    <Pressable
      onPress={() => router.push(`/destination/${destination.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text style={styles.flag}>{destination.flag}</Text>
      <View style={styles.info}>
        <Text style={styles.name}>{destination.name}</Text>
        <Text style={styles.meta}>{destination.region}</Text>
      </View>
      {cheapest && <Text style={styles.price}>from ${cheapest.priceUsd.toFixed(2)}</Text>}
    </Pressable>
  );
}

function getStyles(colors: ColorScheme) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    pressed: {
      opacity: 0.75,
    },
    flag: {
      fontSize: 28,
      marginRight: spacing.md,
    },
    info: {
      flex: 1,
    },
    name: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    meta: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 2,
    },
    price: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '700',
    },
  });
}
