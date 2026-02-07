import { Pressable, StyleSheet, Text, View } from 'react-native';

//index.js is the main screen of the app

export default function HomeScreen() {
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
        <Text style={styles.poweredBy}>
          Powered by{' '}
          <Text style={styles.googleBlue}>G</Text>
          <Text style={styles.googleRed}>o</Text>
          <Text style={styles.googleYellow}>o</Text>
          <Text style={styles.googleBlue}>g</Text>
          <Text style={styles.googleGreen}>l</Text>
          <Text style={styles.googleRed}>e</Text>
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <Pressable style={styles.googleButton}>
          <Text style={styles.googleG}>G</Text>
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
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
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#dadce0',
    minWidth: 260,
    gap: 12,
  },
  googleG: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  googleButtonText: {
    fontSize: 16,
    color: '#9aa0a6',
    fontWeight: '500',
  },
  poweredBy: {
    marginTop: 16,
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    minWidth: 220,
    alignSelf: 'center',
  },
  termsText: {
    marginTop: 20,
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  googleBlue: { color: '#4285F4' },
  googleRed: { color: '#EA4335' },
  googleYellow: { color: '#FBBC05' },
  googleGreen: { color: '#34A853' },
});
