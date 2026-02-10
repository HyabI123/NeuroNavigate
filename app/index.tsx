import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Starter / sign-in screen - first screen of the app (merged with talinbranch)
export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.logoBlock}>
        <View style={styles.logo}>
          <Text style={styles.logoN}>N</Text>
          <View style={styles.logoRight}>
            <Text style={styles.logoTop}>euro</Text>
            <Text style={styles.logoBottom}>avigate</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Pressable
          style={({ pressed }) => [styles.nextButton, pressed && styles.nextButtonPressed]}
          onPress={() => router.push('/language-select')}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  logoBlock: {
    marginBottom: 80,
    alignItems: 'center',
    alignSelf: 'center',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoN: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#165dfc',
    lineHeight: 68,
    marginRight: 4,
  },
  logoRight: {
    height: 68,
    justifyContent: 'space-between',
  },
  logoTop: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#165dfc',
    lineHeight: 32,
  },
  logoBottom: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#165dfc',
    lineHeight: 32,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 56,
  },
  nextButton: {
    marginTop: 16,
    backgroundColor: '#165dfc',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  nextButtonPressed: {
    opacity: 0.8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  termsText: {
    marginTop: 20,
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
