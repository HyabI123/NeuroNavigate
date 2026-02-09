import { StyleSheet, Text, View } from 'react-native';

export default function ItinerariesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Itineraries</Text>
      <Text style={styles.subtitle}>Your trip itineraries will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});
