import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { SensitivityLevel } from '@/contexts/profiles-context';
import { useProfiles } from '@/contexts/profiles-context';

const WAIT_TIME_OPTIONS = ['0-5 minutes', '5-15 minutes', '15-30 minutes'] as const;
const SEATING_OPTIONS = ['Booth', 'Corner', 'Outdoor', 'Away from kitchen'] as const;

type SliderLevel = 0 | 1 | 2; // Low, Med, High

export default function PredictabilityRoutineScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const profileId = typeof params.id === 'string' ? params.id : params.id?.[0];
  const { profiles, updateProfileRoutine } = useProfiles();
  const profile = profileId ? profiles.find((p) => p.id === profileId) : null;

  const [routineLevel, setRoutineLevel] = useState<SliderLevel>(1);
  const [waitTime, setWaitTime] = useState<string | null>(null);
  const [seating, setSeating] = useState<Record<string, boolean>>({
    Booth: false,
    Corner: false,
    Outdoor: false,
    'Away from kitchen': false,
  });

  useEffect(() => {
    if (profile?.routine) {
      const r = profile.routine;
      if (r.routineLevel !== undefined) setRoutineLevel(r.routineLevel as SliderLevel);
      if (r.waitTime !== undefined) setWaitTime(r.waitTime);
      if (r.seating?.length) {
        setSeating((prev) => {
          const next = { ...prev };
          r.seating!.forEach((k) => {
            if (k in next) next[k] = true;
          });
          return next;
        });
      }
    }
  }, [profile?.id]);

  const toggleSeating = (key: string) => {
    setSeating((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNext = () => {
    if (profileId) {
      updateProfileRoutine(profileId, {
        routineLevel,
        waitTime,
        seating: SEATING_OPTIONS.filter((k) => seating[k]),
      });
    }
    router.push(
      profileId
        ? { pathname: '/profile_summary', params: { id: profileId } }
        : '/profile_summary'
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.stepLabel}>Step 5: Predictability & Routine</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Routine Reliance</Text>
          <RoutineSlider value={routineLevel} onChange={setRoutineLevel} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Wait Time Tolerance</Text>
          {WAIT_TIME_OPTIONS.map((option) => (
            <Pressable
              key={option}
              style={styles.radioRow}
              onPress={() => setWaitTime(option)}
            >
              <View style={[styles.radioOuter, waitTime === option && styles.radioOuterSelected]}>
                <View style={[styles.radioInner, waitTime === option && styles.radioInnerSelected]} />
              </View>
              <Text style={styles.radioLabel}>{option}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Seating Preferences</Text>
          {SEATING_OPTIONS.map((key) => (
            <Pressable
              key={key}
              style={styles.checkRow}
              onPress={() => toggleSeating(key)}
            >
              <View style={[styles.checkbox, seating[key] && styles.checkboxChecked]}>
                {seating[key] && (
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

function RoutineSlider({
  value,
  onChange,
}: {
  value: SliderLevel;
  onChange: (v: SliderLevel) => void;
}) {
  const handleTrackPress = (e: { nativeEvent: { locationX: number } }, trackWidth: number) => {
    const x = e.nativeEvent.locationX;
    const segment = trackWidth <= 0 ? 1 : Math.floor((x / trackWidth) * 3);
    const level = Math.max(0, Math.min(2, segment)) as SliderLevel;
    onChange(level);
  };

  return (
    <View style={styles.sliderRow}>
      <RoutineSliderTrack value={value} onTrackPress={handleTrackPress} />
      <View style={styles.sliderLabels}>
        {(['Low', 'Med', 'High'] as const).map((label, i) => (
          <Pressable
            key={label}
            style={styles.sliderLabelTouch}
            onPress={() => onChange(i as SliderLevel)}
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

function RoutineSliderTrack({
  value,
  onTrackPress,
}: {
  value: SliderLevel;
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 14,
  },
  sliderRow: {
    marginBottom: 8,
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
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#9ca3af',
    marginRight: 12,
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
    backgroundColor: 'transparent',
  },
  radioInnerSelected: {
    backgroundColor: '#2563eb',
  },
  radioLabel: {
    fontSize: 16,
    color: '#1a1a1a',
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
