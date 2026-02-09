import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const CUISINE_OPTIONS = [
  'Italian',
  'American',
  'Mexican',
  'Asian',
  'Indian',
  'Mediterranean',
  'Middle Eastern',
  'Japanese',
  'Chinese',
  'Thai',
  'Korean',
  'Café / Bakery',
  'Vegetarian / Vegan',
] as const;

export default function CuisinePreferencesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string | string[];
    mood?: string | string[];
  }>();
  const profileId = typeof params.id === 'string' ? params.id : params.id?.[0];
  const mood = typeof params.mood === 'string' ? params.mood : params.mood?.[0];

  const [selected, setSelected] = useState<Record<string, boolean>>(() => {
    const o: Record<string, boolean> = {};
    CUISINE_OPTIONS.forEach((c) => (o[c] = false));
    return o;
  });

  const toggle = (cuisine: string) => {
    setSelected((prev) => ({ ...prev, [cuisine]: !prev[cuisine] }));
  };

  const hasSelection = useMemo(
    () => Object.values(selected).some(Boolean),
    [selected]
  );

  const handleContinue = () => {
    if (!hasSelection) return;
    const cuisines = CUISINE_OPTIONS.filter((c) => selected[c]).join(',');
    router.push({
      pathname: '/restaurants',
      params: {
        ...(profileId ? { id: profileId } : {}),
        ...(mood ? { mood } : {}),
        cuisines,
      },
    } as import('expo-router').Href);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Cuisine Preferences</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.instruction}>Select any cuisine preferences.</Text>

        <View style={styles.grid}>
          {CUISINE_OPTIONS.map((cuisine) => {
            const isChecked = selected[cuisine];
            return (
              <Pressable
                key={cuisine}
                style={[styles.optionCard, isChecked && styles.optionCardSelected]}
                onPress={() => toggle(cuisine)}
              >
                <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                  {isChecked && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.optionLabel} numberOfLines={1}>
                  {cuisine}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {hasSelection && (
          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              pressed && styles.continueButtonPressed,
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </Pressable>
        )}
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
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: '#1a1a1a',
    position: 'relative',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    zIndex: 1,
  },
  backButtonPressed: {
    opacity: 0.6,
  },
  backButtonText: {
    fontSize: 17,
    color: '#fff',
    marginLeft: 2,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 32,
  },
  instruction: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  optionCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#9ca3af',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  continueButtonPressed: {
    opacity: 0.9,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
});
