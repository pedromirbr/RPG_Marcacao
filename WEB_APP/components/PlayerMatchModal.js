import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  SafeAreaView,
  Alert
} from 'react-native';
import axios from 'axios';

const API_URL = "http://10.0.2.2:3000";

const PlayerMatchModal = ({ visible, onClose, userToken }) => {
  const [profiles, setProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/profiles`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setProfiles(response.data);
      if (response.data.length > 0) {
        setCurrentProfile(response.data[0]);
      } else {
        setError('Não há perfis disponíveis no momento.');
      }
    } catch (err) {
      console.error('Erro ao buscar perfis:', err);
      setError('Erro ao carregar perfis. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchProfiles();
    }
  }, [visible]);

  const handleSwipe = async (direction) => {
    try {
      if (direction === 'right') {
        await axios.post(`${API_URL}/matches`, {
          targetUserId: currentProfile._id
        }, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        Alert.alert('Sucesso', 'Match criado com sucesso!');
      }

      // Passar para o próximo perfil
      const currentIndex = profiles.findIndex(p => p._id === currentProfile._id);
      if (currentIndex < profiles.length - 1) {
        setCurrentProfile(profiles[currentIndex + 1]);
      } else {
        Alert.alert('Fim dos perfis', 'Não há mais perfis disponíveis.', [
          { text: 'OK', onPress: onClose }
        ]);
      }
    } catch (err) {
      console.error('Erro ao processar ação:', err);
      Alert.alert('Erro', 'Não foi possível processar sua ação. Tente novamente.');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Encontrar Jogadores</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchProfiles}
              >
                <Text style={styles.retryButtonText}>Tentar Novamente</Text>
              </TouchableOpacity>
            </View>
          ) : currentProfile ? (
            <View style={styles.profileCard}>
              <Text style={styles.profileName}>{currentProfile.apelido}</Text>
              <Text style={styles.profileRole}>{currentProfile.tipo || 'Jogador'}</Text>
              <Text style={styles.profileDescription}>
                {currentProfile.descricao || 'Sem descrição disponível'}
              </Text>
              <Text style={styles.profileDetails}>
                Sistemas preferidos: {currentProfile.sistemas_preferidos?.join(', ') || 'Não especificado'}
              </Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.passButton]}
                  onPress={() => handleSwipe('left')}
                >
                  <Text style={styles.actionButtonText}>Passar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.matchButton]}
                  onPress={() => handleSwipe('right')}
                >
                  <Text style={styles.actionButtonText}>Match</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={styles.noProfilesText}>Não há mais perfis disponíveis</Text>
          )}
        </View>
      </SafeAreaView>
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
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 28,
    color: '#666',
    fontWeight: 'bold',
  },
  profileCard: {
    padding: 20,
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  profileRole: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
  },
  profileDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    color: '#444',
  },
  profileDetails: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  actionButton: {
    padding: 15,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  passButton: {
    backgroundColor: '#FF3B30',
  },
  matchButton: {
    backgroundColor: '#34C759',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  noProfilesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
});

export default PlayerMatchModal;