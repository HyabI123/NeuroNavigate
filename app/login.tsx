import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

// Required: dismisses the auth popup after redirect
WebBrowser.maybeCompleteAuthSession();

// Get your Client ID from https://console.cloud.google.com/ → APIs & Services → Credentials
// Create OAuth 2.0 Client ID (Web application) and add the redirect URI shown when you run the app.
const GOOGLE_WEB_CLIENT_ID = (process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '').trim();
const hasClientId = GOOGLE_WEB_CLIENT_ID.length > 0;

export default function LoginScreen() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID || 'placeholder',
    iosClientId: GOOGLE_WEB_CLIENT_ID || 'placeholder',
    androidClientId: GOOGLE_WEB_CLIENT_ID || 'placeholder',
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      console.log('logged in');
      const { authentication } = response;
      if (authentication?.accessToken) {
        // Optional: use accessToken for API calls or user info
      }
    }
  }, [response]);

  const handlePress = () => {
    promptAsync();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NeuroNavigate</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <Pressable
        style={({ pressed }) => [
          styles.googleButton,
          (!request || !hasClientId || pressed) && styles.googleButtonDisabled,
        ]}
        onPress={handlePress}
        disabled={!request || !hasClientId}
      >
        {!request ? (
          <ActivityIndicator color="#5f6368" size="small" />
        ) : (
          <>
            <View style={styles.googleIcon}>
              <Text style={styles.googleG}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </>
        )}
      </Pressable>

      {!hasClientId && (
        <View style={styles.setupBox}>
          <Text style={styles.setupTitle}>Setup required</Text>
          <Text style={styles.setupStep}>1. console.cloud.google.com → Credentials → Create OAuth client (Web)</Text>
          <Text style={styles.setupStep}>2. Add redirect URI: neuronavigate:// or https://auth.expo.io</Text>
          <Text style={styles.setupStep}>3. In project root, create .env with:</Text>
          <Text style={styles.setupCode}>EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_client_id</Text>
          <Text style={styles.setupStep}>4. Restart: npm start</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#5f6368',
    marginBottom: 32,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#dadce0',
    minWidth: 240,
    gap: 12,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dadce0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4285f4',
  },
  googleButtonText: {
    fontSize: 16,
    color: '#3c4043',
    fontWeight: '500',
  },
  setupBox: {
    marginTop: 28,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    maxWidth: 340,
  },
  setupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  setupStep: {
    fontSize: 12,
    color: '#5f6368',
    marginBottom: 6,
    lineHeight: 18,
  },
  setupCode: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    backgroundColor: '#e8eaed',
    padding: 8,
    borderRadius: 4,
    marginVertical: 6,
    color: '#1a1a1a',
  },
});
