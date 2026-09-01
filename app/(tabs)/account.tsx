import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useEsims } from '../../lib/esimStore';
import { ColorScheme, radius, spacing } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';

const MENU_ITEMS = [
  { icon: '🧾', label: 'Order history' },
  { icon: '💳', label: 'Payment methods' },
  { icon: '🔔', label: 'Notifications' },
  { icon: '💬', label: 'Help & support' },
  { icon: '⚙️', label: 'Settings' },
];

export default function AccountScreen() {
  const { colors, scheme, toggleScheme } = useTheme();
  const styles = getStyles(colors);
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

      <Text style={styles.sectionLabel}>Appearance</Text>
      <View style={styles.themeToggle}>
        <Pressable
          onPress={() => scheme !== 'light' && toggleScheme()}
          style={[styles.themeOption, scheme === 'light' && styles.themeOptionActive]}
        >
          <Text style={[styles.themeOptionText, scheme === 'light' && styles.themeOptionTextActive]}>☀️ Light</Text>
        </Pressable>
        <Pressable
          onPress={() => scheme !== 'dark' && toggleScheme()}
          style={[styles.themeOption, scheme === 'dark' && styles.themeOptionActive]}
        >
          <Text style={[styles.themeOptionText, scheme === 'dark' && styles.themeOptionTextActive]}>🌙 Dark</Text>
        </Pressable>
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

      <Text style={styles.version}>Weettah v1.0.0</Text>
    </ScrollView>
  );
}

function getStyles(colors: ColorScheme) {
  return StyleSheet.create({
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
      color: colors.onPrimary,
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
    sectionLabel: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: spacing.sm,
    },
    themeToggle: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: 4,
      marginBottom: spacing.lg,
      gap: 4,
    },
    themeOption: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: radius.md,
      alignItems: 'center',
    },
    themeOptionActive: {
      backgroundColor: colors.primary,
    },
    themeOptionText: {
      color: colors.textMuted,
      fontSize: 14,
      fontWeight: '600',
    },
    themeOptionTextActive: {
      color: colors.onPrimary,
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
}
