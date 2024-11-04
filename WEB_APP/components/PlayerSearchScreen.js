import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  TextInput,
  ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Você precisará instalar este pacote

const PlayerSearchScreen = ({ navigation, route }) => {
  const { userData } = route.params;
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [message, setMessage] = useState('');

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:3000/users/list', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userData?.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar jogadores');
      }

      const data = await response.json();
      setPlayers(data.users);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleLike = async (playerId) => {
    try {
      const response = await fetch(`http://10.0.2.2:3000/users/like/${playerId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userData?.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao curtir jogador');
      }

      Alert.alert('Sucesso', 'Jogador curtido com sucesso!');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleFavorite = async (playerId) => {
    try {
      const response = await fetch(`http://10.0.2.2:3000/users/favorite/${playerId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userData?.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao favoritar jogador');
      }

      Alert.alert('Sucesso', 'Jogador favoritado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Erro', 'Digite uma mensagem');
      return;
    }

    try {
      const response = await fetch(`http://10.0.2.2:3000/messages/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userData?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: selectedPlayer.id,
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }

      Alert.alert('Sucesso', 'Mensagem enviada com sucesso!');
      setMessage('');
      setMessageModal(false);
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const renderPlayerItem = ({ item }) => (
    <View style={styles.playerItem}>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.nome}</Text>
        <Text style={styles.playerDetails}>{item.apelido}</Text>
        <Text style={styles.playerDetails}>{item.email}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          onPress={() => handleLike(item.id)}
          style={styles.actionButton}
        >
          <Icon name="thumb-up" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleFavorite(item.id)}
          style={styles.actionButton}
        >
          <Icon name="star" size={24} color="#FFD700" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {
            setSelectedPlayer(item);
            setMessageModal(true);
          }}
          style={styles.actionButton}
        >
          <Icon name="message" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require('../assets/Background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Buscar Jogadores</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Icon name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : (
          <FlatList
            data={players}
            renderItem={renderPlayerItem}
            keyExtractor={(item) => item.email}
            style={styles.playerList}
          />
        )}

        <Modal
          visible={messageModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.messageModalContainer}>
            <View style={styles.messageModalContent}>
              <Text style={styles.messageModalTitle}>
                Enviar mensagem para {selectedPlayer?.nome}
              </Text>
              <TextInput
                style={styles.messageInput}
                multiline
                placeholder="Digite sua mensagem..."
                value={message}
                onChangeText={setMessage}
              />
              <View style={styles.messageModalButtons}>
                <TouchableOpacity 
                  onPress={() => setMessageModal(false)}
                  style={[styles.messageModalButton, styles.cancelButton]}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleMessage}
                  style={[styles.messageModalButton, styles.sendButton]}
                >
                  <Text style={styles.buttonText}>Enviar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0,  0.5)',
  },
  headerText: {
    fontSize: 18,
    color: 'white',
  },
  closeButton: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: 'gray',
  },
  playerList: {
    flex: 1,
    padding: 15,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerDetails: {
    fontSize: 16,
    color: 'gray',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    padding: 10,
  },
  messageModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  messageModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  messageModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  messageModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageModalButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'red',
    marginRight: 5,
  },
  sendButton: {
    backgroundColor: 'green',
    marginLeft: 5,
  },
})