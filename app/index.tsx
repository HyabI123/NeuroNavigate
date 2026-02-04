import { Redirect } from 'expo-router';

// Redirect to login so the app opens on the sign-in screen
export default function Index() {
  return <Redirect href="/login" />;
}
