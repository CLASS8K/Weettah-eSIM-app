import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

import { DepartureReminder } from '../../components/DepartureReminder';
import { DestinationCard } from '../../components/DestinationCard';
import { LandedBanner } from '../../components/LandedBanner';
import { destinations, getDestination } from '../../lib/data';
import { useEsims } from '../../lib/esimStore';
import { ColorScheme, spacing } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';

export default function ExploreScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [query, setQuery] = useState('');
  const { esims, landedDestinationId, clearLanded } = useEsims();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return destinations;
    return destinations.filter(
      (d) => d.name.toLowerCase().includes(q) || d.region.toLowerCase().includes(q)
    );
  }, [query]);

  const landedDestination = landedDestinationId ? getDestination(landedDestinationId) : undefined;
  const nextPendingEsim = esims.find((e) => e.status === 'pending');
  const nextPendingDestination = nextPendingEsim ? getDestination(nextPendingEsim.destinationId) : undefined;

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Weettah</Text>
            <Text style={styles.subtitle}>Stay connected the moment you land. Instant eSIMs, 190+ destinations.</Text>

            {landedDestination && <LandedBanner destination={landedDestination} onDismiss={clearLanded} />}
            {nextPendingEsim && nextPendingDestination && (
              <DepartureReminder esim={nextPendingEsim} destination={nextPendingDestination} />
            )}

            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search a country or region"
              placeholderTextColor={colors.textMuted}
              style={styles.search}
            />
            <Text style={styles.sectionLabel}>Popular destinations</Text>
          </View>
        }
        renderItem={({ item }) => <DestinationCard destination={item} />}
        ListEmptyComponent={<Text style={styles.empty}>No destinations match “{query}”.</Text>}
      />
    </View>
  );
}

function getStyles(colors: ColorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    listContent: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
    },
    title: {
      color: colors.text,
      fontSize: 32,
      fontWeight: '800',
      marginTop: spacing.sm,
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 15,
      marginTop: spacing.xs,
      marginBottom: spacing.lg,
      lineHeight: 21,
    },
    search: {
      backgroundColor: colors.surface,
      color: colors.text,
      borderRadius: 14,
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
      fontSize: 15,
      marginBottom: spacing.lg,
    },
    sectionLabel: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: spacing.sm,
    },
    empty: {
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: spacing.xl,
    },
  });
}
