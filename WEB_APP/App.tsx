import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios';
import HomeScreen from './components/HomeScreen'; // Correct import statement
import LoginScreen from './components/LoginScreen';
import CadastroScreen from './components/CadastroScreen';
import UserDashboard from './components/UserDashboard';

const WebServerURLRegistro = "http://10.0.2.2:3000/register";
const WebServerURLLogin = "http://10.0.2.2:3000/login";

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleNavigate = (screen, data = null) => {
    setCurrentScreen(screen);
    if (data) {
      setUserData(data);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setCurrentScreen('Home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen onNavigate={handleNavigate} />;
      case 'Login':
        return <LoginScreen onNavigate={handleNavigate} setIsLoggedIn={setIsLoggedIn} />;
      case 'Cadastro':
        return <CadastroScreen onNavigate={handleNavigate} />;
      case 'UserDashboard':
        return isLoggedIn ? (
          <UserDashboard onLogout={handleLogout} userData={userData} />
        ) : (
          <HomeScreen onNavigate={handleNavigate} />
        );
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return <View style={styles.container}>{renderScreen()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
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
    opacity: 0.5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 20,
    gap: 10,
  },
  header: {
    width: '100%',
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: '80%',
    marginVertical: 10,
  },
});

export default App;