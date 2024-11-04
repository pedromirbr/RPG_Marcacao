import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import axios from 'axios';

const WebServerURLLogin = "http://10.0.2.2:3000/login";

const LoginScreen = ({ onNavigate, setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email) newErrors.email = 'Email é obrigatório';
    else if (!validateEmail(email)) newErrors.email = 'Email inválido';

    if (!senha) newErrors.senha = 'Senha é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(WebServerURLLogin, { email, senha });
      
      if (response.data) {
        setIsLoggedIn(true);
        onNavigate('UserDashboard', response.data);
      }
    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert(
        "Erro no Login",
        error.response?.data?.message || "Falha ao realizar login. Por favor, verifique suas credenciais.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
          {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => onNavigate('Cadastro')}
          disabled={isLoading}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            Criar nova conta
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={() => onNavigate('Home')}
          disabled={isLoading}
        >
          <Text style={[styles.buttonText, styles.buttonTextOutline]}>
            Voltar para Home
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  errorText: {
    color: '#ff3333',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonSecondary: {
    backgroundColor: '#34C759',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#fff',
  },
  buttonTextOutline: {
    color: '#007AFF',
  },
});

export default LoginScreen;