
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Home');

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen onNavigate={handleNavigate} />;
      case 'Login':
        return <LoginScreen onNavigate={handleNavigate} />;
      case 'Cadastro':
        return <CadastroScreen onNavigate={handleNavigate} />;
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return <View style={styles.container}>{renderScreen()}</View>;
};

const HomeScreen = ({ onNavigate }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Bem-vindo ao Mundo da Fantasia!</Text>
    <Button title="Login" onPress={() => onNavigate('Login')} />
    <Button title="Cadastro" onPress={() => onNavigate('Cadastro')} />
  </View>
);

const LoginScreen = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/login', { email, password });
      // Handle successful login (e.g., navigate to another screen or show a success message)
      console.log("Login successful:", response.data);
      onNavigate('Home'); // Navigate back to Home after successful login
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
      <Button title="Back to Home" onPress={() => onNavigate('Home')} />
    </View>
  );
};

// Placeholder for CadastroScreen
const CadastroScreen = ({ onNavigate }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Cadastro Screen</Text>
    {/* Add your registration form here */}
    <Button title="Back to Home" onPress={() => onNavigate('Home')} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default App;