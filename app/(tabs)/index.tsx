import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useProfiles } from '@/contexts/profiles-context';

const FIXED_ACTIVITIES = [
  {
    id: 'natural-bridges',
    icon: 'leaf' as const,
    title: 'Natural Bridges State Park',
    description: 'Outdoor exploration, beach access',
    duration: '1-2 hours',
    tag: 'Low sensory',
  },
  {
    id: 'seymour-marine',
    icon: 'business' as const,
    title: 'Seymour Marine Discovery Center',
    description: 'Interactive marine exhibits',
    duration: '1.5-2 hours',
    tag: 'Quiet hours',
  },
];

const POOL_ACTIVITIES = [
  { id: 'pool-1', icon: 'cafe' as const, title: 'The Quiet Café', description: 'Low-noise seating, simple menu', duration: '1 hour', tag: 'Low sensory' },
  { id: 'pool-2', icon: 'library' as const, title: 'Downtown Library', description: 'Reading nooks, family programs', duration: '1-2 hours', tag: 'Quiet hours' },
  { id: 'pool-3', icon: 'leaf' as const, title: 'Arboretum Gardens', description: 'Walking paths, nature trails', duration: '2 hours', tag: 'Low sensory' },
  { id: 'pool-4', icon: 'boat' as const, title: 'Harbor Boat Tour', description: 'Scenic cruise, outdoor deck', duration: '1.5 hours', tag: 'Quiet hours' },
  { id: 'pool-5', icon: 'film' as const, title: 'Sensory-Friendly Cinema', description: 'Reduced lights and sound', duration: '2 hours', tag: 'Low sensory' },
  { id: 'pool-6', icon: 'paw' as const, title: 'Animal Rescue Visit', description: 'Meet animals, calm environment', duration: '1 hour', tag: 'Quiet hours' },
];

function pickRandomActivities(count: number) {
  const shuffled = [...POOL_ACTIVITIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profiles, currentProfileId } = useProfiles();

  const currentProfile =
    (currentProfileId ? profiles.find((p) => p.id === currentProfileId) : null) ?? profiles[0] ?? null;
  const planningName = currentProfile?.name?.trim() || 'Select a profile';

  const [refreshKey, setRefreshKey] = useState(0);
  const extraActivities = useMemo(() => pickRandomActivities(2), [refreshKey]);

  const onRefresh = () => setRefreshKey((k) => k + 1);

  const allActivities = useMemo(
    () => [...FIXED_ACTIVITIES, ...extraActivities],
    [extraActivities]
  );

  const handleSwitchProfile = () => {
    router.push({
      pathname: '/select_profile',
      params: { from: 'switch' },
    } as import('expo-router').Href);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 16 + Math.max(insets.top, 24) },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} tintColor="#2563eb" />
        }
      >
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Text style={styles.logoN}>N</Text>
            <View style={styles.logoRight}>
              <Text style={styles.logoTop}>euro</Text>
              <Text style={styles.logoBottom}>avigate</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.planningLabel}>Planning for:</Text>
          <View style={styles.planningRow}>
            <Text style={styles.planningName} numberOfLines={1}>
              {planningName}
            </Text>
            <Pressable
              style={({ pressed }) => [styles.switchButton, pressed && styles.switchButtonPressed]}
              onPress={handleSwitchProfile}
            >
              <Text style={styles.switchText}>Switch</Text>
              <Ionicons name="chevron-down" size={16} color="#2563eb" />
            </Pressable>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          onPress={() => {
            router.push({
              pathname: '/mood_selection',
              params: currentProfileId ? { id: currentProfileId } : {},
            } as import('expo-router').Href);
          }}
        >
          <Ionicons name="restaurant" size={22} color="#fff" />
          <Text style={styles.primaryButtonText}>Discover Restaurants</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
          onPress={() => {}}
        >
          <Ionicons name="calendar" size={22} color="#2563eb" />
          <Text style={styles.secondaryButtonText}>Build an Itinerary</Text>
        </Pressable>

        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>Find an Activity</Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </View>
          {allActivities.map((activity, index) => (
            <View key={activity.id}>
              {index > 0 && <View style={styles.divider} />}
              <View style={styles.activityRow}>
                <View style={styles.activityIconWrap}>
                  <Ionicons name={activity.icon} size={24} color="#6b7280" />
                </View>
                <View style={styles.activityBody}>
                  <Text style={styles.activityName}>{activity.title}</Text>
                  <Text style={styles.activityDesc}>{activity.description}</Text>
                  <View style={styles.activityMeta}>
                    <Ionicons name="time-outline" size={14} color="#9ca3af" />
                    <Text style={styles.activityDuration}>{activity.duration}</Text>
                  </View>
                </View>
                <View style={styles.tagChip}>
                  <Ionicons name="sparkles" size={14} color="#2563eb" />
                  <Text style={styles.tagText}>{activity.tag}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoN: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2563eb',
    marginRight: 4,
  },
  logoRight: {
    justifyContent: 'center',
  },
  logoTop: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2563eb',
    opacity: 0.9,
    lineHeight: 24,
  },
  logoBottom: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2563eb',
    opacity: 0.9,
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0,
  },
  planningLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  planningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planningName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 12,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  switchButtonPressed: {
    opacity: 0.8,
  },
  switchText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563eb',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 24,
  },
  secondaryButtonPressed: {
    opacity: 0.9,
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2563eb',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityIconWrap: {
    width: 40,
    marginRight: 12,
    alignItems: 'center',
  },
  activityBody: {
    flex: 1,
    marginRight: 8,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  activityDesc: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityDuration: {
    fontSize: 13,
    color: '#9ca3af',
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
});
