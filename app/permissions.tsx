import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function PermissionsScreen() {
  const router = useRouter();
  const [showTryAgain, setShowTryAgain] = useState(false);

  const handleAllowAccess = async () => {
    setShowTryAgain(false);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      router.replace('/Add_child_profile' as import('expo-router').Href);
    } else {
      setShowTryAgain(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Allow location to find restaurants near you</Text>

      <View style={styles.pinWrapper}>
        <Ionicons name="location" size={80} color="#2563eb" />
      </View>

      <Pressable
        style={({ pressed }) => [styles.allowButton, pressed && styles.allowButtonPressed]}
        onPress={handleAllowAccess}
      >
        <Text style={styles.allowButtonText}>Allow access</Text>
      </Pressable>

      {showTryAgain && <Text style={styles.tryAgain}>Try again</Text>}
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
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  pinWrapper: {
    marginBottom: 32,
  },
  allowButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allowButtonPressed: {
    opacity: 0.9,
  },
  allowButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  tryAgain: {
    marginTop: 12,
    fontSize: 15,
    color: '#dc2626',
    fontWeight: '500',
  },
});
