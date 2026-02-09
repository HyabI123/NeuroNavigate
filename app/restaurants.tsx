import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { MoodOption } from './mood_selection';

const MOOD_LABELS: Record<MoodOption, string> = {
  adventurous: 'Feeling Adventurous',
  predictability: 'Need Predictability',
  low_energy: 'Low Energy',
  sensory_fragile: 'Sensory Fragile',
  comfort_food: 'Comfort Food',
};

export default function RestaurantsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string | string[];
    mood?: string | string[];
    cuisines?: string | string[];
  }>();
  const profileId = typeof params.id === 'string' ? params.id : params.id?.[0];
  const moodRaw = typeof params.mood === 'string' ? params.mood : params.mood?.[0];
  const mood = moodRaw as MoodOption | undefined;
  const cuisinesRaw = typeof params.cuisines === 'string' ? params.cuisines : params.cuisines?.[0];
  const cuisines = cuisinesRaw?.split(',').filter(Boolean) ?? [];

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
        <Text style={styles.headerTitle}>Restaurants</Text>
      </View>
      <View style={styles.content}>
        {mood && MOOD_LABELS[mood] ? (
          <Text style={styles.moodLabel}>
            Picked: {MOOD_LABELS[mood]} — we'll filter by this.
          </Text>
        ) : (
          <Text style={styles.moodLabel}>No mood filter — showing general recommendations.</Text>
        )}
        {cuisines.length > 0 && (
          <Text style={styles.moodLabel}>Cuisines: {cuisines.join(', ')}</Text>
        )}
        <Text style={styles.placeholder}>
          Restaurant list will go here (filtered by profile, mood, and cuisines when set).
        </Text>
      </View>
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
  content: {
    flex: 1,
    padding: 24,
  },
  moodLabel: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 15,
    color: '#6b7280',
  },
});
