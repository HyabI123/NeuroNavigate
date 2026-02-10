import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Fallback when not provided by API
const MOCK_HOURS = 'Mon-Fri 11AM-9PM · Sat-Sun 10AM-10PM';
const MOCK_PHONE = '(415) 555-1234';
const MOCK_QUIET_TIMES = 'Quietest: 2-4 PM weekdays';
const MOCK_MENU_ANALYSIS = '3 safe foods, 5 to try';

export default function RestaurantDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    name?: string;
    cuisine?: string;
    rating?: string;
    priceLevel?: string;
    bestMatchTag?: string;
    culturalComfort?: string;
    currentCrowd?: string;
    lighting?: string;
    menuSummary?: string;
    allergens?: string;
    usualWaitTime?: string;
    backgroundNoise?: string;
    imageUri?: string;
    address?: string;
  }>();

  const name = params.name ?? 'Restaurant';
  const imageUri = params.imageUri;
  const address = params.address && params.address.trim() ? params.address.trim() : null;
  const usualWaitTime = params.usualWaitTime ?? '5-10 min';
  const lighting = (params.lighting ?? 'soft').toLowerCase();
  const backgroundNoise = (params.backgroundNoise ?? 'low').toLowerCase();

  // Sensory insight labels from params
  const isQuiet = backgroundNoise === 'low' || backgroundNoise === 'moderate';
  const isWarmLighting = lighting === 'soft' || lighting === 'moderate';
  const waitLabel = usualWaitTime ? `Short wait time (${usualWaitTime})` : 'Short wait time (5-10 min)';

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: 12 + insets.top }]}>
        <View style={styles.headerRow}>
          <Pressable
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
            onPress={() => router.back()}
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={28} color="#1a1a1a" />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {name}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.heroImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="restaurant" size={48} color="#9ca3af" />
          </View>
        )}

        <Text style={styles.sectionTitle}>Sensory Insights</Text>
        <View style={styles.insightRow}>
          <View style={[styles.insightTag, styles.insightTagGreen]}>
            <Ionicons name="volume-mute" size={18} color="#b91c1c" />
            <Text style={styles.insightTagText}>Quiet atmosphere</Text>
          </View>
          <View style={[styles.insightTag, styles.insightTagYellow]}>
            <Ionicons name="bulb" size={18} color="#854d0e" />
            <Text style={styles.insightTagText}>Warm, low lighting</Text>
          </View>
          <View style={[styles.insightTag, styles.insightTagBlue]}>
            <Ionicons name="time" size={18} color="#1e40af" />
            <Text style={styles.insightTagText}>{waitLabel}</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => {}}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Menu Analysis</Text>
            <Text style={styles.cardSubtitle}>{MOCK_MENU_ANALYSIS}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => {}}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Quiet Times</Text>
            <Text style={styles.cardSubtitle}>{MOCK_QUIET_TIMES}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </Pressable>

        <View style={styles.contactCard}>
          <View style={styles.contactRow}>
            <Ionicons name="location" size={20} color="#dc2626" />
            <Text style={styles.contactText}>{address || 'Address not available'}</Text>
          </View>
          <View style={styles.contactDivider} />
          <View style={styles.contactRow}>
            <Ionicons name="time" size={20} color="#374151" />
            <Text style={styles.contactText}>{MOCK_HOURS}</Text>
          </View>
          <View style={styles.contactDivider} />
          <View style={styles.contactRow}>
            <Ionicons name="call" size={20} color="#374151" />
            <Text style={styles.contactText}>{MOCK_PHONE}</Text>
          </View>
        </View>
      </ScrollView>

      <Pressable
        style={[styles.fab, { bottom: 24 + insets.bottom }]}
        onPress={() => {}}
      >
        <Ionicons name="warning" size={24} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  backButtonPressed: {
    opacity: 0.6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 16,
  },
  heroImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#e5e7eb',
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  insightRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  insightTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  insightTagGreen: {
    backgroundColor: '#fef9c3',
  },
  insightTagYellow: {
    backgroundColor: '#fef08a',
  },
  insightTagBlue: {
    backgroundColor: '#e0e7ff',
  },
  insightTagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardPressed: {
    opacity: 0.9,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#6b7280',
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  contactText: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
  },
  contactDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginLeft: 30,
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});
