import { Redirect } from 'expo-router';

// Opens on the starter (home) screen
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
