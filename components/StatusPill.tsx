import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EsimStatus } from '../lib/esimStore';
import { ColorScheme, radius } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

const LABELS: Record<EsimStatus, string> = {
  pending: 'Not installed',
  active: 'Active',
  expired: 'Expired',
};

export function StatusPill({ status }: { status: EsimStatus }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const dotColors: Record<EsimStatus, string> = {
    pending: colors.warning,
    active: colors.success,
    expired: colors.danger,
  };

  return (
    <View style={styles.pill}>
      <View style={[styles.dot, { backgroundColor: dotColors[status] }]} />
      <Text style={styles.label}>{LABELS[status]}</Text>
    </View>
  );
}

function getStyles(colors: ColorScheme) {
  return StyleSheet.create({
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: radius.xl,
      alignSelf: 'flex-start',
      gap: 6,
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: 4,
    },
    label: {
      color: colors.text,
      fontSize: 12,
      fontWeight: '600',
    },
  });
}
