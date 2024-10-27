import React from 'react';
import { View, Text, Button, ImageBackground, StyleSheet } from 'react-native';

const HomeScreen = ({ onNavigate }) => (
  <ImageBackground
    source={require('../assets/Background.jpg')}
    style={styles.background}
    imageStyle={styles.image}
    resizeMode="contain" // Alterado para "contain" para preencher a tela
  >
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Mundo da Fantasia!</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="Login" onPress={() => onNavigate('Login')} />
        </View>
        <View style={styles.button}>
          <Button title="Cadastro" onPress={() => onNavigate('Cadastro')} />
        </View>
      </View>
    </View>
  </ImageBackground>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'space-between', // Distribui o espaço entre o título e os botões
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Alinha o título na parte superior
    padding: 20, // Adiciona um pouco de padding
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black', // Muda a cor do texto para preto
  },
  buttonContainer: {
    padding: 20,
    width: '100%',
    flex: 1,
    justifyContent:'flex-end',
  },
  button: {
    marginVertical: 10, // Espaçamento vertical entre os botões
    borderRadius: 5, // Bordas arredondadas
    overflow: 'hidden', // Para que as bordas arredondadas sejam aplicadas
    width: '100%',
    marginBottom: 0,
  },
});

export default HomeScreen;