import { useGemini } from '@/hooks/use-gemini';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function HomeScreen() {
  const [prompt, setPrompt] = useState('');
  const { generate, loading, error, result, clear } = useGemini({ model: 'gemini-2.0-flash' });

  const handleSend = () => {
    if (!prompt.trim()) return;
    generate(prompt.trim()).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NeuroNavigate 🧠</Text>
      <Text style={styles.subtitle}>Gemini 2.0 Flash — tap Send to call the API (no request on load)</Text>

      <TextInput
        style={styles.input}
        placeholder="Ask Gemini anything..."
        placeholderTextColor="#999"
        value={prompt}
        onChangeText={setPrompt}
        editable={!loading}
        multiline
      />
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleSend}
        disabled={loading || !prompt.trim()}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send</Text>
        )}
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}
      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Response:</Text>
          <Text style={styles.resultText} selectable>{result}</Text>
          <Pressable onPress={clear} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Clear</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonPressed: { opacity: 0.8 },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#c5221f',
    marginTop: 12,
    fontSize: 14,
  },
  resultBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  resultText: {
    fontSize: 15,
    color: '#111',
    lineHeight: 22,
  },
  clearBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  clearBtnText: {
    color: '#0a7ea4',
    fontSize: 14,
  },
});
