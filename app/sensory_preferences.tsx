import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  type LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useSensory } from '@/contexts/sensory-context';

const SENSORY_TRIGGERS = [
  'Crowds',
  'Strong smells',
  'Bright lights',
  'Sudden noises',
] as const;

type SensitivityLevel = 0 | 1 | 2; // Low, Med, High

export default function SensoryPreferencesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const profileId = typeof params.id === 'string' ? params.id : params.id?.[0];
  const { customTriggerNames } = useSensory();
  const [noiseLevel, setNoiseLevel] = useState<SensitivityLevel>(1);
  const [lightingLevel, setLightingLevel] = useState<SensitivityLevel>(1);
  const [triggers, setTriggers] = useState<Record<string, boolean>>({
    Crowds: false,
    'Strong smells': false,
    'Bright lights': false,
    'Sudden noises': false,
  });

  const allTriggerKeys = [...SENSORY_TRIGGERS, ...customTriggerNames];

  const toggleTrigger = (key: string) => {
    setTriggers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.stepLabel}>Step 2: Sensory Preferences</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Noise Sensitivity</Text>
          <SensitivitySlider value={noiseLevel} onChange={setNoiseLevel} />
          <Text style={styles.cardLabel}>Lighting Sensitivity</Text>
          <SensitivitySlider value={lightingLevel} onChange={setLightingLevel} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sensory Triggers</Text>
          {allTriggerKeys.map((label) => (
            <Pressable
              key={label}
              style={styles.triggerRow}
              onPress={() => toggleTrigger(label)}
            >
              <View style={[styles.checkbox, triggers[label] && styles.checkboxChecked]}>
                {triggers[label] && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.triggerLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.addTriggerButton, pressed && styles.addTriggerPressed]}
          onPress={() => router.push('/add_custom_trigger' as import('expo-router').Href)}
        >
          <Text style={styles.addTriggerText}>+ Add custom trigger</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.nextButton, pressed && styles.nextButtonPressed]}
          onPress={() => {
            if (profileId) {
              router.push({ pathname: '/food_preferences', params: { id: profileId } } as import('expo-router').Href);
            } else {
              router.push('/food_preferences' as import('expo-router').Href);
            }
          }}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function SensitivitySlider({
  value,
  onChange,
}: {
  value: SensitivityLevel;
  onChange: (v: SensitivityLevel) => void;
}) {
  const handleTrackPress = (e: { nativeEvent: { locationX: number } }, trackWidth: number) => {
    const x = e.nativeEvent.locationX;
    const segment = trackWidth <= 0 ? 1 : Math.floor((x / trackWidth) * 3);
    const level = Math.max(0, Math.min(2, segment)) as SensitivityLevel;
    onChange(level);
  };

  return (
    <View style={styles.sliderRow}>
      <SliderTrack value={value} onTrackPress={handleTrackPress} />
      <View style={styles.sliderLabels}>
        {(['Low', 'Med', 'High'] as const).map((label, i) => (
          <Pressable
            key={label}
            style={styles.sliderLabelTouch}
            onPress={() => onChange(i as SensitivityLevel)}
          >
            <Text
              style={[
                styles.sliderLabelText,
                value === i && styles.sliderLabelTextActive,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function SliderTrack({
  value,
  onTrackPress,
}: {
  value: SensitivityLevel;
  onTrackPress: (e: { nativeEvent: { locationX: number } }, trackWidth: number) => void;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width);
  return (
    <Pressable
      onLayout={onLayout}
      onPress={(e) => onTrackPress(e as unknown as { nativeEvent: { locationX: number } }, trackWidth)}
      style={styles.sliderTrack}
    >
      <View
        style={[
          styles.sliderThumb,
          value === 0 && styles.sliderThumbLow,
          value === 1 && styles.sliderThumbMed,
          value === 2 && styles.sliderThumbHigh,
        ]}
      />
    </Pressable>
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
  cardLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 14,
  },
  sliderRow: {
    marginBottom: 24,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#9ca3af',
    borderRadius: 3,
    marginBottom: 8,
    position: 'relative',
  },
  sliderThumb: {
    position: 'absolute',
    top: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2563eb',
  },
  sliderThumbLow: {
    left: 0,
  },
  sliderThumbMed: {
    left: '50%',
    marginLeft: -10,
  },
  sliderThumbHigh: {
    right: 0,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  sliderLabelTouch: {
    flex: 1,
    alignItems: 'center',
  },
  sliderLabelText: {
    fontSize: 14,
    color: '#6b7280',
  },
  sliderLabelTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  triggerRow: {
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
  triggerLabel: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  addTriggerButton: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9ca3af',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  addTriggerPressed: {
    opacity: 0.8,
  },
  addTriggerText: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
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
