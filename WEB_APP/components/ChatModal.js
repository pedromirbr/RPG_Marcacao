// components/ChatModal.js
import React, { useState, useEffect, useRef, userData} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';

const API_URL = "http://10.0.2.2:3000";

const ChatModal = ({ visible, onClose, userToken, matchData }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef();

  useEffect(() => {
    if (visible && matchData) {
      fetchMessages();
      // Configurar um intervalo para buscar novas mensagens periodicamente
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [visible, matchData]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/messages/${matchData._id}`,
        {
          headers: { Authorization: `Bearer ${userToken}` }
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        `${API_URL}/messages`,
        {
          matchId: matchData._id,
          content: newMessage.trim(),
        },
        {
          headers: { Authorization: `Bearer ${userToken}` }
        }
      );

      setMessages([...messages, response.data]);
      setNewMessage('');
      flatListRef.current?.scrollToEnd();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.senderId === matchData.usuario_id1._id ? styles.sentMessage : styles.receivedMessage
    ]}>
      <Text style={styles.messageSender}>
        {item.senderId === matchData.usuario_id1._id ? 'Você' : matchData.usuario_id2.apelido}
      </Text>
      <Text style={styles.messageContent}>{item.content}</Text>
      <Text style={styles.messageTime}>
        {new Date(item.createdAt).toLocaleTimeString()}
      </Text>
    </View>
  );

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
            <Text style={styles.modalTitle}>
              Chat com {matchData?.usuario_id2.apelido}
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Digite sua mensagem..."
              multiline
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={sendMessage}
            >
              <Text style={styles.sendButtonText}>Enviar</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#007AFF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  messagesList: {
    padding: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageSender: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  messageContent: {
    fontSize: 16,
    color: '#000',
  },
  messageTime: {
    fontSize: 10,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChatModal;