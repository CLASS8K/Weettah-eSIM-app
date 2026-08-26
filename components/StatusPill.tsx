import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '../theme/colors';
import { EsimStatus } from '../lib/esimStore';

const LABELS: Record<EsimStatus, string> = {
  pending: 'Not installed',
  active: 'Active',
  expired: 'Expired',
};

const DOT_COLORS: Record<EsimStatus, string> = {
  pending: colors.warning,
  active: colors.success,
  expired: colors.danger,
};

export function StatusPill({ status }: { status: EsimStatus }) {
  return (
    <View style={styles.pill}>
      <View style={[styles.dot, { backgroundColor: DOT_COLORS[status] }]} />
      <Text style={styles.label}>{LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
