import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useProfiles } from '@/contexts/profiles-context';
import {
  fetchNearbyRestaurants,
  getActiveFilterLabels,
  type Restaurant,
} from '@/lib/restaurants';

export default function RestaurantsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id?: string | string[];
    mood?: string | string[];
    cuisines?: string | string[];
  }>();
  const profileId = typeof params.id === 'string' ? params.id : params.id?.[0];
  const cuisinesRaw = typeof params.cuisines === 'string' ? params.cuisines : params.cuisines?.[0];
  const cuisines = cuisinesRaw ? cuisinesRaw.split(',').filter(Boolean) : [];

  const { profiles } = useProfiles();
  const profile = profileId
    ? (profiles.find((p) => p.id === profileId) || null)
    : null;
  const filterChips = getActiveFilterLabels(profile);

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let latitude = 37.7749;
      let longitude = -122.4194;
      let cityOrRegion: string | undefined;

      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.LocationAccuracy.Balanced,
          });
          latitude = loc.coords.latitude;
          longitude = loc.coords.longitude;
          const [addr] = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });
          if (addr?.city) cityOrRegion = [addr.city, addr.region].filter(Boolean).join(', ');
        } catch {
          // keep defaults
        }
      }

      const list = await fetchNearbyRestaurants({
        latitude,
        longitude,
        cityOrRegion,
        cuisines,
        profile,
      });
      setRestaurants(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load restaurants');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, [cuisines.join(','), profile?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const openDetail = (r: Restaurant) => {
    router.push({
      pathname: '/restaurant_detail',
      params: {
        name: r.name,
        cuisine: r.cuisine,
        rating: String(r.rating),
        priceLevel: String(r.priceLevel),
        bestMatchTag: r.bestMatchTag,
        culturalComfort: r.culturalComfort.join(','),
        currentCrowd: r.currentCrowd,
        lighting: r.lighting,
        menuSummary: r.menuSummary,
        allergens: r.allergens.join(','),
        usualWaitTime: r.usualWaitTime,
        backgroundNoise: r.backgroundNoise,
        ...(r.imageUri ? { imageUri: r.imageUri } : {}),
        ...(r.address ? { address: r.address } : {}),
      },
    } as import('expo-router').Href);
  };

  const planningName = (profile && profile.name && profile.name.trim()) || 'your child';

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
        <Text style={styles.headerTitle}>Restaurants Near You</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Finding restaurants for you…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={load}>
            <Text style={styles.retryButtonText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.curated}>
            Curated for {planningName}'s sensory and comfort preferences
          </Text>

          {filterChips.length > 0 && (
            <View style={styles.chipRow}>
              {filterChips.map((label) => (
                <View key={label} style={styles.chip}>
                  <Text style={styles.chipText}>{label}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.matchCount}>
            {restaurants.length} {restaurants.length === 1 ? 'place' : 'places'} match your
            preferences
          </Text>
          <Text style={styles.sectionTitle}>Top Matches</Text>

          {restaurants.map((r) => (
            <View key={`${r.name}-${r.cuisine}`} style={styles.card}>
              <View style={styles.cardMain}>
                <View style={styles.cardBody}>
                  <Text style={styles.cardName}>{r.name}</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={16} color="#eab308" />
                    <Text style={styles.ratingText}>{r.rating.toFixed(1)}</Text>
                    <Text style={styles.priceText}>{'$'.repeat(r.priceLevel)}</Text>
                  </View>
                  <Text style={styles.cuisineText}>{r.cuisine}</Text>
                  <View style={styles.bestMatchWrap}>
                    <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                    <Text style={styles.bestMatchText}>{r.bestMatchTag}</Text>
                  </View>
                  <Text style={styles.sensoryDetail}>
                    {r.lighting === 'soft' ? 'Soft' : r.lighting === 'moderate' ? 'Moderate' : 'Bright'}{' '}
                    lighting ·{' '}
                    {r.backgroundNoise === 'low'
                      ? 'Low'
                      : r.backgroundNoise === 'moderate'
                        ? 'Moderate'
                        : 'High'}{' '}
                    background noise
                  </Text>
                  <Text style={styles.culturalDetail}>
                    Cultural comfort: {r.culturalComfort.join(', ')}
                  </Text>
                </View>
                {r.imageUri ? (
                  <Image source={{ uri: r.imageUri }} style={styles.cardImage} />
                ) : (
                  <View style={styles.imagePlaceholder} />
                )}
              </View>
              <Pressable
                style={({ pressed }) => [styles.viewDetailsButton, pressed && styles.viewDetailsPressed]}
                onPress={() => openDetail(r)}
              >
                <Text style={styles.viewDetailsText}>View Details</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 15,
    color: '#dc2626',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#2563eb',
    borderRadius: 10,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 16,
  },
  curated: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  chipText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  matchCount: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#fde047',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fefce8',
  },
  cardMain: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  cardBody: {
    flex: 1,
    marginRight: 12,
  },
  cardName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  priceText: {
    fontSize: 14,
    color: '#6b7280',
  },
  cuisineText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  bestMatchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#dcfce7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  bestMatchText: {
    fontSize: 13,
    color: '#166534',
    fontWeight: '500',
  },
  sensoryDetail: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 2,
  },
  culturalDetail: {
    fontSize: 13,
    color: '#4b5563',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  viewDetailsButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewDetailsPressed: {
    opacity: 0.9,
  },
  viewDetailsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
