import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import type { ChildProfile, SensitivityLevel } from '@/contexts/profiles-context';
import { useProfiles } from '@/contexts/profiles-context';

const LEVEL_LABELS: Record<SensitivityLevel, string> = {
  0: 'Low',
  1: 'Med',
  2: 'High',
};

function formatBasicInfo(profile: ChildProfile): string {
  const name = profile.name?.trim();
  const age = profile.age?.trim();
  if (!name && !age) return 'None';
  if (!name) return `Age ${age}`;
  if (!age) return name;
  return `${name}, Age ${age}`;
}

function formatSensory(profile: ChildProfile): string {
  const s = profile.sensory;
  if (!s) return 'None';
  const noise = s.noiseLevel !== undefined ? LEVEL_LABELS[s.noiseLevel] : null;
  const light = s.lightingLevel !== undefined ? LEVEL_LABELS[s.lightingLevel] : null;
  const triggers = s.triggerNames?.length ? s.triggerNames.join(', ') : null;
  const parts: string[] = [];
  if (noise || light) parts.push(`Noise: ${noise ?? '—'}, Lighting: ${light ?? '—'}`);
  if (triggers) parts.push(`Triggers: ${triggers}`);
  return parts.length ? parts.join('\n') : 'None';
}

function formatFood(profile: ChildProfile): string {
  const f = profile.food;
  if (!f) return 'None';
  const safe = f.safeFoods?.length ? f.safeFoods.join(', ') : null;
  const aversions = f.aversions?.length ? f.aversions.join(', ') : null;
  const dietary = f.dietary?.length ? f.dietary.join(', ') : null;
  const parts: string[] = [];
  if (safe) parts.push(`Safe: ${safe}`);
  if (aversions) parts.push(`Aversions: ${aversions}`);
  if (dietary) parts.push(`Dietary: ${dietary}`);
  return parts.length ? parts.join('\n') : 'None';
}

function formatCommunication(profile: ChildProfile): string {
  const method = profile.communicationMethod
    ? profile.communicationMethod.charAt(0).toUpperCase() + profile.communicationMethod.slice(1)
    : null;
  const primary = profile.primaryLanguage?.trim();
  const secondary = profile.secondaryLanguage?.trim();
  const parts: string[] = [];
  if (method) parts.push(method);
  if (primary) parts.push(primary);
  if (secondary) parts.push(secondary);
  return parts.length ? parts.join(', ') : 'None';
}

function formatRoutine(profile: ChildProfile): string {
  const r = profile.routine;
  if (!r) return 'None';
  const level = r.routineLevel !== undefined ? LEVEL_LABELS[r.routineLevel] : null;
  const routineText = level ? `${level} routine reliance` : null;
  const wait = r.waitTime || null;
  const seating = r.seating?.length ? r.seating.join(', ') : null;
  const parts: string[] = [];
  if (routineText) parts.push(routineText);
  if (wait) parts.push(`${wait} wait tolerance`);
  if (seating) parts.push(`Prefers: ${seating}`);
  return parts.length ? parts.join('\n') : 'None';
}

export default function ProfileSummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const profileId = typeof params.id === 'string' ? params.id : params.id?.[0];
  const { profiles, setCurrentProfileId } = useProfiles();
  const profile = profileId ? profiles.find((p) => p.id === profileId) : null;

  if (!profileId || !profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Profile not found.</Text>
      </View>
    );
  }

  const handleSaveProfile = () => {
    setCurrentProfileId(profileId);
    router.replace('/(tabs)' as import('expo-router').Href);
  };

  const editRoutes: { path: string; params?: { id: string } }[] = [
    { path: '/add_profile_form', params: { id: profileId } },
    { path: '/sensory_preferences', params: { id: profileId } },
    { path: '/food_preferences', params: { id: profileId } },
    { path: '/communication_language', params: { id: profileId } },
    { path: '/predictability_routine', params: { id: profileId } },
  ];

  const cards = [
    { title: 'Basic Info', summary: formatBasicInfo(profile), icon: 'person' as const, editIndex: 0 },
    { title: 'Sensory Preferences', summary: formatSensory(profile), icon: 'volume-high' as const, editIndex: 1 },
    { title: 'Food Preferences', summary: formatFood(profile), icon: 'restaurant' as const, editIndex: 2 },
    { title: 'Communication', summary: formatCommunication(profile), icon: 'chatbubble' as const, editIndex: 3 },
    { title: 'Routine & Predictability', summary: formatRoutine(profile), icon: 'calendar' as const, editIndex: 4 },
  ];

  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={28} color="#1a1a1a" />
        </Pressable>
        <Text style={styles.headerTitle}>Create Child Profile</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.stepLabel}>Step 6: Profile Summary</Text>

        {cards.map((card) => {
          const edit = editRoutes[card.editIndex];
          return (
            <View key={card.title} style={styles.card}>
              <View style={styles.cardRow}>
                <Ionicons name={card.icon} size={24} color="#2563eb" style={styles.cardIcon} />
                <View style={styles.cardTextWrap}>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  <Text style={styles.cardSummary}>{card.summary}</Text>
                </View>
                <Pressable
                  style={({ pressed }) => [styles.editButton, pressed && styles.editButtonPressed]}
                  onPress={() =>
                    router.push(
                      edit.params
                        ? { pathname: edit.path as any, params: edit.params }
                        : (edit.path as any)
                    )
                  }
                  hitSlop={12}
                >
                  <Ionicons name="pencil" size={20} color="#6b7280" />
                </Pressable>
              </View>
            </View>
          );
        })}

        <Pressable
          style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}
          onPress={handleSaveProfile}
        >
          <Text style={styles.saveButtonText}>SAVE PROFILE</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
  },
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    padding: 4,
    marginRight: 4,
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
    paddingTop: 16,
    paddingBottom: 32,
  },
  stepLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  cardTextWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  cardSummary: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  editButton: {
    padding: 4,
  },
  editButtonPressed: {
    opacity: 0.6,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonPressed: {
    opacity: 0.9,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
});
