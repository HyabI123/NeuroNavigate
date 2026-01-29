import { StyleSheet, Text, View } from 'react-native';

//index.js is the main screen of the app

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NeuroNavigate 🧠</Text>
      <Text>Welcome to my app</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
