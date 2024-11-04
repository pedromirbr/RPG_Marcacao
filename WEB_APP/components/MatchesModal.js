// components/MatchesModal.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import axios from 'axios';
import ChatModal from './ChatModal';

const API_URL = "http://10.0.2.2:3000";

const MatchesModal = ({ visible, onClose, userToken, userData }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchMatches();
    }
  }, [visible]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/matches`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setMatches(response.data);
    } catch (error) {
      console.error('Erro ao buscar matches:', error);
      Alert.alert('Erro', 'Não foi possível carregar os matches');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = (match) => {
    setSelectedMatch(match);
    setIsChatModalVisible(true);
  };

  const renderMatch = ({ item }) => (
    <TouchableOpacity
      style={styles.matchItem}
      onPress={() => handleStartChat(item)}
    >
      <View style={styles.matchInfo}>
        <Text style={styles.matchName}>
          {item.usuario_id1.apelido === userData?.apelido 
            ? item.usuario_id2.apelido 
            : item.usuario_id1.apelido}
        </Text>
        <Text style={styles.matchStatus}>
          Status: {item.status}
        </Text>
        <Text style={styles.matchDate}>
          Match em: {new Date(item.data_criacao).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seus Matches</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
          ) : matches.length > 0 ? (
            <FlatList
              data={matches}
              renderItem={renderMatch}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.matchesList}
            />
          ) : (
            <Text style={styles.noMatchesText}>
              Você ainda não tem matches
            </Text>
          )}
        </View>

        {selectedMatch && (
          <ChatModal
            visible={isChatModalVisible}
            onClose={() => {
              setIsChatModalVisible(false);
              setSelectedMatch(null);
            }}
            userToken={userToken}
            matchData={selectedMatch}
            userData={userData}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  loader: {
    padding: 20,
  },
  matchesList: {
    padding: 10,
  },
  matchItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  matchInfo: {
    gap: 5,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  matchStatus: {
    fontSize: 14,
    color: '#666',
  },
  matchDate: {
    fontSize: 12,
    color: '#999',
  },
  noMatchesText: {
    padding: 20,
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
});

export default MatchesModal;