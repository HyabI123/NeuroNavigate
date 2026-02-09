import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { LanguageProvider } from '@/contexts/language-context';
import { ProfilesProvider } from '@/contexts/profiles-context';
import { SensoryProvider } from '@/contexts/sensory-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <LanguageProvider>
        <ProfilesProvider>
        <SensoryProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ title: 'Sign in' }} />
            <Stack.Screen name="language-select" options={{ title: 'Select language' }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="permissions" options={{ headerShown: false }} />
            <Stack.Screen name="add_child_profile" options={{ headerShown: false }} />
            <Stack.Screen
              name="add_profile_form"
              options={{ title: 'Add Child Profile' }}
            />
            <Stack.Screen
              name="select_profile"
              options={{
                title: 'Select Child Profile',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="sensory_preferences"
              options={{ title: 'Create Child Profile', headerBackTitle: 'Back' }}
            />
            <Stack.Screen
              name="add_custom_trigger"
              options={{ title: 'Create Child Profile', headerBackTitle: 'Back' }}
            />
            <Stack.Screen
              name="food_preferences"
              options={{ title: 'Create Child Profile', headerBackTitle: 'Back' }}
            />
            <Stack.Screen
              name="predictability_routine"
              options={{ title: 'Create Child Profile', headerBackTitle: 'Back' }}
            />
            <Stack.Screen
              name="communication_language"
              options={{ title: 'Create Child Profile', headerBackTitle: 'Back' }}
            />
            <Stack.Screen
              name="profile_summary"
              options={{ title: 'Create Child Profile', headerBackTitle: 'Back' }}
            />
            <Stack.Screen
              name="mood_selection"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="cuisine_preferences"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="restaurants"
              options={{ headerShown: false }}
            />
          </Stack>
        </SensoryProvider>
        </ProfilesProvider>
      </LanguageProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
