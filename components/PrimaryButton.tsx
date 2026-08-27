import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { ColorScheme, radius, spacing } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
};

export function PrimaryButton({ label, onPress, loading, disabled, variant = 'primary' }: Props) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const isOutline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isOutline ? styles.outline : styles.primary,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && !loading && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primary : colors.onPrimary} />
      ) : (
        <Text style={[styles.label, isOutline ? styles.labelOutline : styles.labelPrimary]}>{label}</Text>
      )}
    </Pressable>
  );
}

function getStyles(colors: ColorScheme) {
  return StyleSheet.create({
    base: {
      borderRadius: radius.lg,
      paddingVertical: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: {
      backgroundColor: colors.primary,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    disabled: {
      opacity: 0.5,
    },
    pressed: {
      opacity: 0.85,
    },
    label: {
      fontSize: 16,
      fontWeight: '700',
    },
    labelPrimary: {
      color: colors.onPrimary,
    },
    labelOutline: {
      color: colors.primary,
    },
  });
}
