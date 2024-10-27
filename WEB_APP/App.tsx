
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground  } from 'react-native';
import axios from 'axios';

const WebServerURLRegistro = "http://10.0.2.2:3000/register"
const WebServerURLLogin = "http://10.0.2.2:3000/login"

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
  <ImageBackground
    source={require('./assets/Background.jpg')}
    style={styles.background}
    imageStyle={styles.image}
    resizeMode="cover"
  >
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Mundo da Fantasia!</Text>
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={() => onNavigate('Login')} />
        <Button title="Cadastro" onPress={() => onNavigate('Cadastro')} />
      </View>
    </View>
  </ImageBackground>
);


const LoginScreen = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(WebServerURLLogin, { email, senha });
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
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
      <Button title="Back to Home" onPress={() => onNavigate('Home')} />
    </View>
  );
};

// Placeholder for CadastroScreen
const CadastroScreen = (onNavigate) => {
  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastro = async () => {
    // Lógica para enviar os dados para o servidor
    try {
      const response = await axios.post(WebServerURLRegistro, {
        nome,
        apelido,
        email,
        telefone,
        senha,
      });
      console.log('Usuário cadastrado com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="apelido"
        value={apelido}
        onChangeText={setApelido}
      />
      <TextInput
        style={styles.input}
        placeholder="email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="telefone"
        value={telefone}
        onChangeText={setTelefone}
      />
      <TextInput
        style={styles.input}
        placeholder="senha"
        value={senha}
        onChangeText={setSenha}
      />      
      <Button title="Cadastrar" onPress={handleCadastro} />
      <Button title="Back to Home" onPress={() => onNavigate('Home')} />      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Distribui o espaço entre os elementos
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
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
  background: {
    flex: 1,
    justifyContent: 'center',
     width: '100%',
  },
  image: {
    opacity: 0.5, // Define a transparência da imagem de fundo
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center', // Centraliza os botões
  },
});

export default App;