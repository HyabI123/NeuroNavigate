import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useSensory } from '@/contexts/sensory-context';

const COMMON_EXAMPLES = [
  'Flickering lights',
  'Echoing spaces',
  'Strong perfumes',
  'Background music',
  'Clinking dishes',
  'Air conditioning noise',
];

export default function AddCustomTriggerScreen() {
  const router = useRouter();
  const { addCustomTrigger } = useSensory();
  const [customText, setCustomText] = useState('');
  const [selectedExample, setSelectedExample] = useState<string | null>(null);

  const handleAddTrigger = () => {
    const name = customText.trim() || selectedExample;
    if (name) {
      addCustomTrigger(name);
      router.back();
    }
  };

  const canAdd = customText.trim().length > 0 || selectedExample !== null;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.pageTitle}>Add Custom Trigger</Text>
        <Text style={styles.description}>
          Describe a sensory trigger that affects your child in restaurant environments
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Trigger Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Loud hand dryers in restroom"
            placeholderTextColor="#9ca3af"
            value={customText}
            onChangeText={setCustomText}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Common Examples</Text>
          <Text style={styles.tapHint}>Tap to use these triggers:</Text>
          <View style={styles.chipsRow}>
            {COMMON_EXAMPLES.map((label) => (
              <Pressable
                key={label}
                style={[
                  styles.chip,
                  selectedExample === label && styles.chipSelected,
                ]}
                onPress={() =>
                  setSelectedExample((prev) => (prev === label ? null : label))
                }
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedExample === label && styles.chipTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            (!canAdd && styles.addButtonDisabled) || (pressed && styles.addButtonPressed),
          ]}
          onPress={handleAddTrigger}
          disabled={!canAdd}
        >
          <Text style={styles.addButtonText}>Add Trigger</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.cancelButton, pressed && styles.cancelButtonPressed]}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#fff',
  },
  tapHint: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  chipSelected: {
    backgroundColor: '#2563eb',
  },
  chipText: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonPressed: {
    opacity: 0.9,
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonPressed: {
    opacity: 0.8,
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
