import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';

export default function App() {
  const [area, setArea] = useState('');
  const [result, setResult] = useState('');

  const calculate = () => {
    if (area && !isNaN(area)) {
      const bricks = Math.ceil(parseFloat(area) * 51 * 1.05);
      setResult(`Нужно ${bricks} кирпичей`);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🧱 Калькулятор кирпича</Text>
        
        <Text style={styles.label}>Площадь стены (м²):</Text>
        <TextInput
          style={styles.input}
          value={area}
          onChangeText={setArea}
          keyboardType="numeric"
          placeholder="Введите площадь"
        />
        
        <TouchableOpacity style={styles.button} onPress={calculate}>
          <Text style={styles.buttonText}>Рассчитать</Text>
        </TouchableOpacity>
        
        {result ? <Text style={styles.result}>{result}</Text> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    fontSize: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  result: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    color: '#007AFF',
  },
});
