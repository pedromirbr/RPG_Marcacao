import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import CadastroScreen from './components/CadastroScreen';
import UserDashboard from './components/UserDashboard';


interface UserData {
  nome: string;
  email: string;
  apelido: string;
  telefone: string;
  tipo: 'Jogador' | 'Mestre';
  descricao?: string;
  sistemas_preferidos?: string[];
  data_criacao: Date;
  ultima_atualizacao: Date;
}

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleNavigate = (screen: string, data: UserData | null = null) => {
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
        return isLoggedIn && userData ? (
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
    backgroundColor: '#f5f5f5',
  },
});

export default App;