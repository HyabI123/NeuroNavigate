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
      <View style={styles.topSection}>
        <View style={styles.iconWrapper}>
          <Ionicons name="location" size={80} color="#2563eb" />
        </View>
        <Text style={styles.heading}>Location Access</Text>
        <Text style={styles.description}>
          We use your location to find nearby sensory-friendly places and restaurants that work for your family.
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.allowButton, pressed && styles.allowButtonPressed]}
        onPress={handleAllowAccess}
      >
        <Text style={styles.allowButtonText}>Allow</Text>
      </Pressable>

      {showTryAgain && <Text style={styles.tryAgain}>Please go to your settings and enable location access.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topSection: {
    marginBottom: 80,
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
  description: {
    marginTop: 16,
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  allowButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 180,
  },
  allowButtonPressed: {
    opacity: 0.9,
  },
  allowButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  tryAgain: {
    marginTop: 12,
    fontSize: 15,
    color: '#dc2626',
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 24,
    alignSelf: 'center',
  },
});
