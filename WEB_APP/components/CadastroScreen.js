import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import axios from 'axios';

const WebServerURLRegistro = "http://10.0.2.2:3000/register";

const CadastroScreen = ({ onNavigate }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [apelido, setApelido] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('Jogador');
  const [descricao, setDescricao] = useState('');
  const [sistemas_preferidos, setSistemasPreferidos] = useState('');

  const handleCadastro = async () => {
    if (!nome || !email || !apelido || !telefone || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const response = await axios.post(WebServerURLRegistro, {
        nome,
        email,
        apelido,
        telefone,
        senha,
        tipo,
        descricao,
        sistemas_preferidos: sistemas_preferidos.split(',').map(sistema => sistema.trim())
      });

      console.log('Usuário cadastrado com sucesso:', response.data);
      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      onNavigate('Home');
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error.response?.data?.message || error.message);
      Alert.alert("Erro", error.response?.data?.message || "Erro ao cadastrar usuário. Tente novamente.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Apelido"
        value={apelido}
        onChangeText={setApelido}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      
      <Text style={styles.label}>Tipo de Usuário:</Text>
      <View style={styles.radioGroup}>
        <View style={styles.radioButton}>
          <RadioButton
            value="Jogador"
            status={tipo === 'Jogador' ? 'checked' : 'unchecked'}
            onPress={() => setTipo('Jogador')}
          />
          <Text>Jogador</Text>
        </View>
        <View style={styles.radioButton}>
          <RadioButton
            value="Mestre"
            status={tipo === 'Mestre' ? 'checked' : 'unchecked'}
            onPress={() => setTipo('Mestre')}
          />
          <Text>Mestre</Text>
        </View>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Sistemas Preferidos (separados por vírgula)"
        value={sistemas_preferidos}
        onChangeText={setSistemasPreferidos}
      />

      <Button title="Cadastrar" onPress={handleCadastro} />
      <Button title="Voltar para Home" onPress={() => onNavigate('Home')} />      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  input: {
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
});

export default CadastroScreen;