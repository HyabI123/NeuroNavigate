import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useProfiles } from '@/contexts/profiles-context';

const SUGGESTED_SAFE_FOODS = ['Pasta', 'Chicken nuggets', 'Rice'];
const SUGGESTED_AVERSIONS = ['Mushrooms', 'Spicy foods'];
const DIETARY_RESTRICTIONS = [
  'Vegetarian',
  'Halal',
  'Gluten-Free',
  'Nut-Free',
  'Dairy-Free',
] as const;

const DEFAULT_DIETARY: Record<string, boolean> = {
  Vegetarian: false,
  Halal: false,
  'Gluten-Free': false,
  'Nut-Free': false,
  'Dairy-Free': false,
};

export default function FoodPreferencesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const profileId = typeof params.id === 'string' ? params.id : params.id?.[0];
  const { profiles, updateProfileFood } = useProfiles();
  const profile = profileId ? profiles.find((p) => p.id === profileId) : null;

  const [safeFoods, setSafeFoods] = useState<string[]>([]);
  const [safeFoodInput, setSafeFoodInput] = useState('');
  const [aversions, setAversions] = useState<string[]>([]);
  const [aversionInput, setAversionInput] = useState('');
  const [dietary, setDietary] = useState<Record<string, boolean>>({
    ...DEFAULT_DIETARY,
  });

  useEffect(() => {
    if (profile?.food) {
      const f = profile.food;
      if (f.safeFoods?.length) setSafeFoods(f.safeFoods);
      if (f.aversions?.length) setAversions(f.aversions);
      if (f.dietary?.length) {
        setDietary((prev) => {
          const next = { ...DEFAULT_DIETARY };
          f.dietary!.forEach((k) => {
            if (k in next) next[k] = true;
          });
          return next;
        });
      }
    }
  }, [profile?.id]);

  const toggleSafeFood = (item: string) => {
    setSafeFoods((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const addSafeFood = () => {
    const trimmed = safeFoodInput.trim();
    if (trimmed && !safeFoods.includes(trimmed)) {
      setSafeFoods((prev) => [...prev, trimmed]);
      setSafeFoodInput('');
    }
  };

  const toggleAversion = (item: string) => {
    setAversions((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const addAversion = () => {
    const trimmed = aversionInput.trim();
    if (trimmed && !aversions.includes(trimmed)) {
      setAversions((prev) => [...prev, trimmed]);
      setAversionInput('');
    }
  };

  const toggleDietary = (key: string) => {
    setDietary((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNext = () => {
    if (profileId) {
      updateProfileFood(profileId, {
        safeFoods,
        aversions,
        dietary: Object.entries(dietary)
          .filter(([, v]) => v)
          .map(([k]) => k),
      });
    }
    router.push(
      profileId
        ? { pathname: '/communication_language', params: { id: profileId } }
        : '/communication_language'
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.stepLabel}>Step 3: Food Preferences</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Safe Foods</Text>
          <View style={styles.chipsRow}>
            {SUGGESTED_SAFE_FOODS.map((item) => (
              <Pressable
                key={item}
                style={[styles.chip, safeFoods.includes(item) && styles.chipSelected]}
                onPress={() => toggleSafeFood(item)}
              >
                <Text
                  style={[
                    styles.chipText,
                    safeFoods.includes(item) && styles.chipTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Add safe food"
            placeholderTextColor="#9ca3af"
            value={safeFoodInput}
            onChangeText={setSafeFoodInput}
            onSubmitEditing={addSafeFood}
            returnKeyType="done"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Food Aversions</Text>
          <View style={styles.chipsRow}>
            {SUGGESTED_AVERSIONS.map((item) => (
              <Pressable
                key={item}
                style={[styles.chip, aversions.includes(item) && styles.chipSelected]}
                onPress={() => toggleAversion(item)}
              >
                <Text
                  style={[
                    styles.chipText,
                    aversions.includes(item) && styles.chipTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Add aversion"
            placeholderTextColor="#9ca3af"
            value={aversionInput}
            onChangeText={setAversionInput}
            onSubmitEditing={addAversion}
            returnKeyType="done"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
          {DIETARY_RESTRICTIONS.map((key) => (
            <Pressable
              key={key}
              style={styles.checkRow}
              onPress={() => toggleDietary(key)}
            >
              <View
                style={[
                  styles.checkbox,
                  dietary[key] && styles.checkboxChecked,
                ]}
              >
                {dietary[key] && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.checkLabel}>{key}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.nextButton, pressed && styles.nextButtonPressed]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>
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
    padding: 24,
    paddingTop: 16,
  },
  stepLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#e8e8e8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 14,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#d1d5db',
  },
  chipSelected: {
    backgroundColor: '#2563eb',
  },
  chipText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#9ca3af',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#fff',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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
  checkLabel: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  nextButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  nextButtonPressed: {
    opacity: 0.9,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
});
