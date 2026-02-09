import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SensoryPreferencesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const profileId = typeof params.id === 'string' ? params.id : params.id?.[0];

  const handleNext = () => {
    if (profileId) {
      router.push({
        pathname: '/communication_language',
        params: { id: profileId },
      } as import('expo-router').Href);
    } else {
      router.push('/communication_language' as import('expo-router').Href);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensory Preferences</Text>
      <Text style={styles.stepLabel}>Step 3</Text>
      <Pressable
        style={({ pressed }) => [styles.nextButton, pressed && styles.nextButtonPressed]}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  stepLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 24,
  },
  nextButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
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
