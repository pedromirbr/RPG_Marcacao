import React from 'react';
import { View, Text, Button, ImageBackground, StyleSheet } from 'react-native';

const UserDashboard = ({ onLogout, userData }) => {
  const handleSearchPlayer = () => {
    console.log('Procurando jogadores...');
  };

  return (
    <ImageBackground
      source={require('../assets/Background.jpg')}
      style={styles.background}
      imageStyle={styles.image}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Bem-vindo, {userData?.apelido || 'Jogador'}!</Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.button}>
            <Button 
              title="Procurar Jogadores" 
              onPress={handleSearchPlayer}
              color="#4CAF50" // cor verde
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button 
              title="Logout" 
              onPress={onLogout} 
              color="#ff0000" 
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
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
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%', // Faz o botão ocupar 80% da largura do container
    marginVertical: 10,
  },
});

export default UserDashboard;