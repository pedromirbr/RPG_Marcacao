import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';

const HomeScreen = ({ onNavigate }) => (
  <ImageBackground
    source={require('../assets/Background.jpg')}
    style={styles.background}
    resizeMode="cover"
  >
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo ao Mundo da Fantasia!</Text>
        <Text style={styles.subtitle}>Encontre seu grupo de RPG ideal</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onNavigate('Login')}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => onNavigate('Cadastro')}
          >
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
              Criar nova conta
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </ImageBackground>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adiciona um overlay escuro para melhor legibilidade
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
  },
  buttonSecondary: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#FFFFFF',
  },
});

export default HomeScreen;