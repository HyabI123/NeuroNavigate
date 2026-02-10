import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type MoodOption =
  | 'adventurous'
  | 'predictability'
  | 'low_energy'
  | 'sensory_fragile'
  | 'comfort_food';

const MOOD_OPTIONS: {
  value: MoodOption;
  title: string;
  subtitle: string;
}[] = [
  {
    value: 'adventurous',
    title: 'Feeling Adventurous',
    subtitle: 'Open to trying new places today.',
  },
  {
    value: 'predictability',
    title: 'Need Predictability',
    subtitle: 'Prefer familiar, quieter, calmer environments.',
  },
  {
    value: 'low_energy',
    title: 'Low Energy',
    subtitle: 'Soft, easy outings with low stimulation.',
  },
  {
    value: 'sensory_fragile',
    title: 'Sensory Fragile',
    subtitle: 'Highly sensory-sensitive today; safest options.',
  },
  {
    value: 'comfort_food',
    title: 'Comfort Food',
    subtitle: 'Stick to culturally familiar & safe meals.',
  },
];

export default function MoodSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const profileId = typeof params.id === 'string' ? params.id : params.id?.[0];
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>('adventurous');

  const handleNext = () => {
    router.push({
      pathname: '/cuisine_preferences',
      params: {
        ...(profileId ? { id: profileId } : {}),
        ...(selectedMood ? { mood: selectedMood } : {}),
      },
    } as import('expo-router').Href);
  };

  const handleSkip = () => {
    router.push({
      pathname: '/cuisine_preferences',
      params: profileId ? { id: profileId } : {},
    } as import('expo-router').Href);
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: 12 + insets.top }]}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={28} color="#1a1a1a" />
        </Pressable>
        <Text style={styles.headerTitle}>Mood Selection</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.question}>How is your child feeling today?</Text>
        <Text style={styles.subtitle}>This helps us choose the most suitable places.</Text>

        {MOOD_OPTIONS.map((opt) => {
          const isSelected = selectedMood === opt.value;
          return (
            <Pressable
              key={opt.value}
              style={[styles.optionCard, isSelected && styles.optionCardSelected]}
              onPress={() => setSelectedMood(opt.value)}
            >
              <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionTitle}>{opt.title}</Text>
                <Text style={styles.optionSubtitle}>{opt.subtitle}</Text>
              </View>
            </Pressable>
          );
        })}

        <Pressable
          style={({ pressed }) => [styles.nextButton, pressed && styles.nextButtonPressed]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.skipButton, pressed && styles.skipButtonPressed]}
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>Skip Mood Selection</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 12,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  backButton: {
    padding: 4,
    marginRight: 4,
    zIndex: 1,
  },
  backButtonPressed: {
    opacity: 0.6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 32,
  },
  question: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#9ca3af',
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  radioOuterSelected: {
    borderColor: '#2563eb',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563eb',
  },
  optionTextWrap: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  nextButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  nextButtonPressed: {
    opacity: 0.9,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  skipButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  skipButtonPressed: {
    opacity: 0.9,
  },
  skipButtonText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#6b7280',
  },
});
