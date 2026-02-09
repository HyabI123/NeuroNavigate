import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  type CommunicationMethod,
  useProfiles,
} from '@/contexts/profiles-context';

const COMMUNICATION_OPTIONS: { value: CommunicationMethod; label: string }[] = [
  { value: 'verbal', label: 'Verbal' },
  { value: 'semi-verbal', label: 'Semi-verbal' },
  { value: 'nonverbal', label: 'Nonverbal' },
];

const LANGUAGE_OPTIONS = [
  'English',
  'Spanish',
  'French',
  'German',
  'Mandarin',
  'Arabic',
  'Portuguese',
  'Hindi',
  'Other',
];

export default function CommunicationLanguageScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const profileId = typeof params.id === 'string' ? params.id : params.id?.[0];
  const { profiles, updateProfileCommunication } = useProfiles();
  const profile = profileId ? profiles.find((p) => p.id === profileId) : null;

  const [communicationMethod, setCommunicationMethod] =
    useState<CommunicationMethod | null>(null);
  const [primaryLanguage, setPrimaryLanguage] = useState<string>('');
  const [secondaryLanguage, setSecondaryLanguage] = useState<string>('');
  const [communicationNotes, setCommunicationNotes] = useState('');
  const [primaryDropdownOpen, setPrimaryDropdownOpen] = useState(false);
  const [secondaryDropdownOpen, setSecondaryDropdownOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      setCommunicationMethod(profile.communicationMethod ?? null);
      setPrimaryLanguage(profile.primaryLanguage ?? 'English');
      setSecondaryLanguage(profile.secondaryLanguage ?? '');
      setCommunicationNotes(profile.communicationNotes ?? '');
    }
  }, [profile?.id]);

  const handleNext = () => {
    if (profileId && profile) {
      updateProfileCommunication(profileId, {
        communicationMethod: communicationMethod ?? undefined,
        primaryLanguage: primaryLanguage || undefined,
        secondaryLanguage: secondaryLanguage || undefined,
        communicationNotes: communicationNotes.trim() || undefined,
      });
    }
    router.push('/predictability_routine' as import('expo-router').Href);
  };

  if (profileId && !profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Profile not found.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.stepLabel}>Step 4: Communication & Language</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            How does your child communicate?
          </Text>
          {COMMUNICATION_OPTIONS.map((opt) => {
            const isSelected = communicationMethod === opt.value;
            return (
              <Pressable
                key={opt.value}
                style={[
                  styles.radioOption,
                  isSelected && styles.radioOptionSelected,
                ]}
                onPress={() => setCommunicationMethod(opt.value)}
              >
                <View
                  style={[
                    styles.radioCircle,
                    isSelected && styles.radioCircleSelected,
                  ]}
                >
                  {isSelected && <View style={styles.radioCircleInner} />}
                </View>
                <Text style={styles.radioLabel}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Child Primary Language</Text>
          <Pressable
            style={styles.dropdown}
            onPress={() => {
              setPrimaryDropdownOpen(!primaryDropdownOpen);
              setSecondaryDropdownOpen(false);
            }}
          >
            <Text style={styles.dropdownText}>
              {primaryLanguage || 'Select language'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </Pressable>
          {primaryDropdownOpen && (
            <ScrollView
              style={styles.dropdownList}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <Pressable
                  key={lang}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setPrimaryLanguage(lang);
                    setPrimaryDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{lang}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Child Secondary Language (optional)
          </Text>
          <Pressable
            style={styles.dropdown}
            onPress={() => {
              setSecondaryDropdownOpen(!secondaryDropdownOpen);
              setPrimaryDropdownOpen(false);
            }}
          >
            <Text style={styles.dropdownText}>
              {secondaryLanguage || 'Select language'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </Pressable>
          {secondaryDropdownOpen && (
            <ScrollView
              style={styles.dropdownList}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator
            >
              <Pressable
                style={styles.dropdownItem}
                onPress={() => {
                  setSecondaryLanguage('');
                  setSecondaryDropdownOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>None</Text>
              </Pressable>
              {LANGUAGE_OPTIONS.map((lang) => (
                <Pressable
                  key={lang}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSecondaryLanguage(lang);
                    setSecondaryDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{lang}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Communication Notes (optional)
          </Text>
          <TextInput
            style={styles.notesInput}
            value={communicationNotes}
            onChangeText={setCommunicationNotes}
            placeholder="Add any additional notes."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
          />
        </View>

        <Pressable
          style={({ pressed }) => [styles.nextButton, pressed && styles.nextButtonPressed]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  radioOptionSelected: {
    borderColor: '#2563eb',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#9ca3af',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioCircleSelected: {
    borderColor: '#2563eb',
  },
  radioCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563eb',
  },
  radioLabel: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6b7280',
  },
  dropdownList: {
    marginTop: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  notesInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1a1a1a',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  nextButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
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
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    padding: 24,
  },
});
