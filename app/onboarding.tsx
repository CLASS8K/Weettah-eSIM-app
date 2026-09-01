import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PlanCard } from '../components/PlanCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { destinations, getDestination, getPlansForDestination, Plan } from '../lib/data';
import { useEsims } from '../lib/esimStore';
import { useOnboarding } from '../lib/onboarding';
import { ColorScheme, radius, spacing } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

type Step = 1 | 2 | 3 | 4 | 5;

const FREQUENCIES = ['Rarely', 'Monthly', 'Weekly'] as const;

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { purchaseEsim, activateEsim } = useEsims();
  const { markComplete } = useOnboarding();

  const [step, setStep] = useState<Step>(1);
  const [selectedDestinationIds, setSelectedDestinationIds] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [purchasedEsimId, setPurchasedEsimId] = useState<string | null>(null);
  const [provisioning, setProvisioning] = useState(false);

  const toggleDestination = (id: string) => {
    setSelectedDestinationIds((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  };

  const planDestinationId = selectedDestinationIds[0] ?? destinations[0].id;
  const planDestination = getDestination(planDestinationId)!;
  const plansForDestination = getPlansForDestination(planDestinationId);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    const esim = purchaseEsim(plan.id);
    setPurchasedEsimId(esim.id);
    setStep(4);
  };

  const handleProvision = () => {
    if (!purchasedEsimId) return;
    setProvisioning(true);
    setTimeout(() => {
      activateEsim(purchasedEsimId);
      setProvisioning(false);
      setStep(5);
    }, 1400);
  };

  const handleFinish = () => {
    markComplete();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {step === 1 && (
        <View style={styles.stepFill}>
          <View style={styles.heroSpacer} />
          <Text style={styles.eyebrow}>THE NEW STANDARD</Text>
          <Text style={styles.hero}>Weettah</Text>
          <Text style={styles.heroTagline}>Connectivity that just works, everywhere you land.</Text>
          <View style={{ flex: 1 }} />
          <PrimaryButton label="Get started" onPress={() => setStep(2)} />
          <Text style={styles.footnote}>Join thousands of connected travelers.</Text>
        </View>
      )}

      {step === 2 && (
        <ScrollView style={styles.stepFill} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.eyebrow}>PERSONALIZATION</Text>
          <Text style={styles.title}>Where are you heading next?</Text>
          <View style={styles.flagGrid}>
            {destinations.map((d) => {
              const selected = selectedDestinationIds.includes(d.id);
              return (
                <Pressable
                  key={d.id}
                  onPress={() => toggleDestination(d.id)}
                  style={[styles.flagChip, selected && styles.flagChipSelected]}
                >
                  <Text style={styles.flagChipEmoji}>{d.flag}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>How often do you travel?</Text>
          <View style={styles.freqRow}>
            {FREQUENCIES.map((freq) => (
              <Pressable key={freq} onPress={() => setStep(3)} style={styles.freqOption}>
                <Text style={styles.freqOptionText}>{freq}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}

      {step === 3 && (
        <ScrollView style={styles.stepFill} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.eyebrow}>YOUR FIRST PLAN</Text>
          <Text style={styles.title}>
            {planDestination.flag} {planDestination.name}
          </Text>
          <Text style={styles.subtitle}>Pick a data plan to get set up.</Text>
          <View style={styles.plans}>
            {plansForDestination.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onPress={() => handleSelectPlan(plan)} />
            ))}
          </View>
        </ScrollView>
      )}

      {step === 4 && selectedPlan && (
        <View style={styles.stepFill}>
          <Text style={styles.eyebrow}>ACTIVATION</Text>
          <Text style={styles.title}>Install your digital identity</Text>
          <View style={styles.installStep}>
            <View style={styles.installBadge}>
              <Text style={styles.installBadgeText}>✓</Text>
            </View>
            <View style={styles.installTextCol}>
              <Text style={styles.installTitle}>Purchase verified</Text>
              <Text style={styles.installBody}>
                Your {planDestination.name} data profile is ready for deployment.
              </Text>
            </View>
          </View>
          <View style={styles.installStep}>
            <View style={[styles.installBadge, styles.installBadgeAccent]}>
              <Text style={styles.installBadgeText}>2</Text>
            </View>
            <View style={styles.installTextCol}>
              <Text style={styles.installTitle}>Hardware sync</Text>
              <Text style={styles.installBody}>We'll provision the eSIM to your device.</Text>
              <View style={styles.installButtonSpacer} />
              <PrimaryButton
                label={provisioning ? 'Provisioning…' : 'Install profile'}
                onPress={handleProvision}
                loading={provisioning}
              />
            </View>
          </View>
        </View>
      )}

      {step === 5 && (
        <View style={styles.stepFill}>
          <View style={{ flex: 1 }} />
          <View style={styles.successBadge}>
            <Text style={styles.successBadgeText}>✓</Text>
          </View>
          <Text style={styles.successTitle}>You're ready</Text>
          <Text style={styles.successBody}>
            Your {planDestination.name} eSIM profile is active. Welcome to the future of travel.
          </Text>
          <View style={{ flex: 1 }} />
          <PrimaryButton label="Enter Weettah" onPress={handleFinish} />
        </View>
      )}
    </View>
  );
}

function getStyles(colors: ColorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    stepFill: {
      flex: 1,
      padding: spacing.lg,
      paddingTop: spacing.xl * 2,
    },
    scrollContent: {
      paddingBottom: spacing.xl,
    },
    heroSpacer: {
      height: spacing.xl,
    },
    eyebrow: {
      color: colors.primary,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1.5,
      marginBottom: spacing.sm,
    },
    hero: {
      color: colors.text,
      fontSize: 56,
      fontWeight: '800',
      letterSpacing: -1,
      marginBottom: spacing.md,
    },
    heroTagline: {
      color: colors.textMuted,
      fontSize: 18,
      lineHeight: 25,
      maxWidth: 260,
    },
    footnote: {
      color: colors.textMuted,
      fontSize: 12,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    title: {
      color: colors.text,
      fontSize: 30,
      fontWeight: '800',
      marginBottom: spacing.lg,
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 14,
      marginTop: -spacing.md,
      marginBottom: spacing.lg,
    },
    flagGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.xl,
    },
    flagChip: {
      width: 68,
      height: 68,
      borderRadius: radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    flagChipSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '22',
    },
    flagChipEmoji: {
      fontSize: 30,
    },
    sectionLabel: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase',
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    freqRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    freqOption: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    freqOptionText: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '600',
    },
    plans: {
      marginTop: spacing.sm,
    },
    installStep: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.xl,
      alignItems: 'flex-start',
    },
    installBadge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.success + '22',
      alignItems: 'center',
      justifyContent: 'center',
    },
    installBadgeAccent: {
      backgroundColor: colors.primary + '22',
    },
    installBadgeText: {
      color: colors.text,
      fontWeight: '800',
    },
    installTextCol: {
      flex: 1,
    },
    installTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 2,
    },
    installBody: {
      color: colors.textMuted,
      fontSize: 13,
      lineHeight: 18,
    },
    installButtonSpacer: {
      height: spacing.md,
    },
    successBadge: {
      width: 84,
      height: 84,
      borderRadius: 28,
      backgroundColor: colors.success,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: spacing.lg,
    },
    successBadgeText: {
      color: '#FFFFFF',
      fontSize: 40,
      fontWeight: '800',
    },
    successTitle: {
      color: colors.text,
      fontSize: 32,
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    successBody: {
      color: colors.textMuted,
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 21,
      paddingHorizontal: spacing.lg,
    },
  });
}
