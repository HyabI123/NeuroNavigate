import { StyleSheet, Text, View } from 'react-native';

export default function SensoryPreferencesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensory Preferences</Text>
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
});
