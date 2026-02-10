import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function AddChildProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to</Text>
      <Text style={styles.appName}>NeuroNavigate</Text>
      <Text style={styles.description}>
        Let's set up your first child profile to get personalized restaurant and
        trip recommendations.
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
        ]}
        onPress={() =>
          router.push('/add_profile_form' as import('expo-router').Href)
        }
      >
        <Ionicons name="add" size={22} color="#fff" />
        <Text style={styles.addButtonText}>Add Child Profile</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [pressed && { opacity: 0.7 }]}
        onPress={() =>
          router.push('/select_profile' as import('expo-router').Href)
        }
      >
        <Text style={styles.continueLink}>Continue to select profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  addButtonPressed: {
    opacity: 0.9,
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  continueLink: {
    marginTop: 24,
    fontSize: 15,
    color: '#2563eb',
    fontWeight: '500',
  },
});
