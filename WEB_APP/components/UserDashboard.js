// UserDashboard.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image
} from 'react-native';
import PlayerMatchModal from './PlayerMatchModal';
import MatchesModal from './MatchesModal';

const UserDashboard = ({ onLogout, userData }) => {
  const [isPlayerMatchModalVisible, setIsPlayerMatchModalVisible] = useState(false);
  const [isMatchesModalVisible, setIsMatchesModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem-vindo(a), {userData.nome}!</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profileInfo}>
          <Text style={styles.infoText}>Email: {userData.email}</Text>
          <Text style={styles.infoText}>Apelido: {userData.apelido}</Text>
          <Text style={styles.infoText}>Tipo: {userData.tipo}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsPlayerMatchModalVisible(true)}
          >
            <Text style={styles.buttonText}>Procurar Jogadores</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsMatchesModalVisible(true)}
          >
            <Text style={styles.buttonText}>Meus Matches</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={onLogout}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <PlayerMatchModal
        visible={isPlayerMatchModalVisible}
        onClose={() => setIsPlayerMatchModalVisible(false)}
        userToken={userData.token}
      />

      <MatchesModal
        visible={isMatchesModalVisible}
        onClose={() => setIsMatchesModalVisible(false)}
        userToken={userData.token}
        userData={userData}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserDashboard;