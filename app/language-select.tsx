import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useLanguage } from '@/contexts/language-context';

const LANGUAGES = [
  'Arabic',
  'Bengali',
  'Czech',
  'Danish',
  'Dutch',
  'English',
  'Finnish',
  'French',
  'German',
  'Greek',
  'Hebrew',
  'Hindi',
  'Hungarian',
  'Indonesian',
  'Italian',
  'Japanese',
  'Korean',
  'Malay',
  'Mandarin',
  'Norwegian',
  'Persian',
  'Polish',
  'Portuguese',
  'Punjabi',
  'Romanian',
  'Russian',
  'Spanish',
  'Swedish',
  'Tagalog',
  'Thai',
  'Turkish',
  'Ukrainian',
  'Urdu',
  'Vietnamese',
];

export default function LanguageSelectScreen() {
  const router = useRouter();
  const { setSelectedLanguage } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (language: string) => {
    setSelected(language);
  };

  const handleSubmit = () => {
    if (!selected) return;
    setSelectedLanguage(selected);
    router.replace('/permissions' as import('expo-router').Href);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What language would you like to use?</Text>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {LANGUAGES.map((lang) => {
          const isSelected = selected === lang;
          return (
            <Pressable
              key={lang}
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
                isSelected && styles.optionSelected,
              ]}
              onPress={() => handleSelect(lang)}
            >
              <View style={[styles.bubble, isSelected && styles.bubbleFilled]} />
              <Text style={styles.optionText}>{lang}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            !selected && styles.submitButtonDisabled,
            pressed && selected && styles.submitButtonPressed,
          ]}
          onPress={handleSubmit}
          disabled={!selected}
        >
          <Text style={[styles.submitText, !selected && styles.submitTextDisabled]}>
            Submit
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
    gap: 14,
  },
  optionPressed: {
    backgroundColor: '#f5f5f5',
  },
  optionSelected: {
    backgroundColor: '#f0f7ff',
  },
  bubble: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: 'transparent',
  },
  bubbleFilled: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  optionText: {
    fontSize: 17,
    color: '#1a1a1a',
  },
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  submitButtonPressed: {
    opacity: 0.9,
  },
  submitText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  submitTextDisabled: {
    color: '#94a3b8',
  },
});
