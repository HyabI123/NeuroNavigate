import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useProfiles } from '@/contexts/profiles-context';

export default function SelectProfileScreen() {
  const router = useRouter();
  const { profiles } = useProfiles();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleProfile = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const hasSelection = selectedIds.size > 0;

  const handleContinue = () => {
    if (!hasSelection) return;
    const firstSelectedId = Array.from(selectedIds)[0];
    router.push({
      pathname: '/sensory_preferences',
      params: { id: firstSelectedId },
    } as import('expo-router').Href);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Child Profile</Text>
      <Text style={styles.subtitle}>Select one or more profiles to customize your search.</Text>
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {profiles.length === 0 ? (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No profiles yet</Text>
          </View>
        ) : (
          profiles.map((p) => {
            const isSelected = selectedIds.has(p.id);
            return (
              <Pressable
                key={p.id}
                style={styles.profileRow}
                onPress={() => toggleProfile(p.id)}
              >
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <View style={styles.avatarPlaceholder} />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{p.name}</Text>
                  <Text style={styles.profileAge}>Age: {p.age}</Text>
                </View>
                <Pressable
                  hitSlop={12}
                  onPress={(e) => {
                    e.stopPropagation();
                    router.push({
                      pathname: '/add_profile_form',
                      params: { id: p.id },
                    } as import('expo-router').Href);
                  }}
                >
                  <Ionicons name="pencil" size={20} color="#6b7280" />
                </Pressable>
              </Pressable>
            );
          })
        )}
        <Pressable
          style={({ pressed }) => [styles.addNewButton, pressed && styles.addNewButtonPressed]}
          onPress={() => router.push('/add_profile_form' as import('expo-router').Href)}
        >
          <Ionicons name="add" size={20} color="#374151" />
          <Text style={styles.addNewButtonText}>Add New Profile</Text>
        </Pressable>
      </ScrollView>
      <Pressable
        style={({ pressed }) => [
          styles.discoverButton,
          pressed && styles.discoverButtonPressed,
        ]}
        onPress={() => {
          const firstId = hasSelection ? Array.from(selectedIds)[0] : undefined;
          router.push(
            (firstId
              ? { pathname: '/mood_selection', params: { id: firstId } }
              : '/mood_selection') as import('expo-router').Href
          );
        }}
      >
        <Text style={styles.discoverButtonText}>Discover restaurants</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.continueButton,
          hasSelection && styles.continueButtonActive,
          pressed && hasSelection && styles.continueButtonPressed,
        ]}
        onPress={handleContinue}
        disabled={!hasSelection}
      >
        <Text
          style={[
            styles.continueButtonText,
            hasSelection && styles.continueButtonTextActive,
          ]}
        >
          Continue
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#9ca3af',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e5e7eb',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  profileAge: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 8,
  },
  addNewButtonPressed: {
    opacity: 0.9,
  },
  addNewButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  placeholder: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  continueButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 32,
  },
  continueButtonActive: {
    backgroundColor: '#2563eb',
  },
  continueButtonPressed: {
    opacity: 0.9,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#374151',
  },
  continueButtonTextActive: {
    color: '#fff',
  },
  discoverButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  discoverButtonPressed: {
    opacity: 0.9,
  },
  discoverButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
});
