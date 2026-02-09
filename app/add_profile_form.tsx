import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useProfiles } from '@/contexts/profiles-context';

export default function AddProfileFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0];
  const { addProfile, updateProfile, profiles } = useProfiles();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const isEditing = !!id;
  const profile = isEditing ? profiles.find((p) => p.id === id) : null;

  useEffect(() => {
    if (isEditing && profile) {
      setName(profile.name);
      setAge(profile.age);
    }
  }, [isEditing, profile?.id]);

  const handleSave = () => {
    const trimmedName = name.trim();
    const trimmedAge = age.trim();
    if (!trimmedName || !trimmedAge) return;
    if (isEditing && id) {
      updateProfile(id, trimmedName, trimmedAge);
      router.back();
    } else {
      const newId = addProfile(trimmedName, trimmedAge);
      router.replace({
        pathname: '/sensory_preferences',
        params: { id: newId },
      } as import('expo-router').Href);
    }
  };

  const canSave = name.trim().length > 0 && age.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Child's name"
          placeholderTextColor="#9ca3af"
          autoCapitalize="words"
        />
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Age"
          placeholderTextColor="#9ca3af"
          keyboardType="number-pad"
        />
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            !canSave && styles.saveButtonDisabled,
            pressed && canSave && styles.saveButtonPressed,
          ]}
          onPress={handleSave}
          disabled={!canSave}
        >
          <Text
            style={[
              styles.saveButtonText,
              !canSave && styles.saveButtonTextDisabled,
            ]}
          >
            Save
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 24,
    paddingTop: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  saveButtonPressed: {
    opacity: 0.9,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  saveButtonTextDisabled: {
    color: '#94a3b8',
  },
});
