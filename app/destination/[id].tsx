import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { PlanCard } from '../../components/PlanCard';
import { getDestination, getPlansForDestination } from '../../lib/data';
import { ColorScheme, spacing } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';

export default function DestinationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const destination = getDestination(id);
  const plans = getPlansForDestination(id);

  if (!destination) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Destination not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: destination.name }} />
      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.flag}>{destination.flag}</Text>
            <Text style={styles.name}>{destination.name}</Text>
            <Text style={styles.coverage}>Coverage: {destination.coverage.join(', ')}</Text>
            <Text style={styles.sectionLabel}>Choose a data plan</Text>
          </View>
        }
        renderItem={({ item }) => (
          <PlanCard plan={item} onPress={() => router.push(`/plan/${item.id}`)} />
        )}
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
    header: {
      marginBottom: spacing.md,
    },
    flag: {
      fontSize: 40,
    },
    name: {
      color: colors.text,
      fontSize: 24,
      fontWeight: '800',
      marginTop: spacing.xs,
    },
    coverage: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 4,
      marginBottom: spacing.lg,
    },
    sectionLabel: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: spacing.sm,
    },
    notFound: {
      color: colors.textMuted,
      padding: spacing.lg,
    },
  });
}
