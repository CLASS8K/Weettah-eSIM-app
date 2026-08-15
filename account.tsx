import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useEsims } from '../../lib/esimStore';
import { colors, radius, spacing } from '../../theme/colors';

const MENU_ITEMS = [
  { icon: '🧾', label: 'Order history' },
  { icon: '💳', label: 'Payment methods' },
  { icon: '🔔', label: 'Notifications' },
  { icon: '💬', label: 'Help & support' },
  { icon: '⚙️', label: 'Settings' },
];

export default function AccountScreen() {
  const { esims } = useEsims();
  const activeCount = esims.filter((e) => e.status === 'active').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Account</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>T</Text>
        </View>
        <View>
          <Text style={styles.profileName}>Traveler</Text>
          <Text style={styles.profileMeta}>
            {esims.length} eSIM{esims.length === 1 ? '' : 's'} · {activeCount} active
          </Text>
        </View>
      </View>

      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => (
          <View key={item.label} style={styles.menuRow}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        ))}
      </View>

      <Text style={styles.version}>TakeFlyt v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.textDark,
    fontSize: 22,
    fontWeight: '800',
  },
  profileName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  profileMeta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  menu: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuLabel: {
    color: colors.text,
    fontSize: 15,
    flex: 1,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 20,
  },
  version: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
