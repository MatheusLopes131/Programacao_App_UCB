import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Button, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// --- Passo 2: Componente Input extraído ---
function Input({ placeholder, value, onChangeText, editable = true }) {
  return (
    <TextInput
      style={[styles.input, !editable && styles.inputDisabled]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
    />
  );
}

export default function App() {
  // --- Passo 1: Estado do Nome ---
  const [nome, setNome] = useState('João Silva');

  // --- Passo 3: Estado do E-mail e controle de edição ---
  const [email, setEmail] = useState('joao@exemplo.com');
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {/* --- Passo 5: Ícone e texto na mesma linha --- */}
        <TouchableOpacity style={styles.changePhotoButton}>
          <Feather name="camera" size={20} color="#007AFF" />
          <Text style={styles.changePhotoText}>Alterar foto</Text>
        </TouchableOpacity>

        {/* --- Seção Nome (Passo 1 e Passo 4) --- */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nome</Text>
          <Input 
            placeholder="Digite seu nome"
            value={nome} 
            onChangeText={setNome} 
          />
          
          {/* Passo 4: Contagem de caracteres */}
          <Text style={styles.charCount}>{nome.length} caracteres</Text>
          
          {/* Passo 1: Botão Limpar */}
          <View style={styles.buttonWrapper}>
            <Button title="Limpar Nome" onPress={() => setNome('')} color="#FF3B30" />
          </View>
        </View>

        {/* --- Seção E-mail (Passo 3) --- */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>E-mail</Text>
          <Input 
            placeholder="Digite seu e-mail"
            value={email} 
            onChangeText={setEmail} 
            editable={isEditingEmail}
          />
          
          {/* Passo 3: Botão Editar/Salvar */}
          <View style={styles.buttonWrapper}>
            <Button 
              title={isEditingEmail ? "Salvar E-mail" : "Editar E-mail"} 
              onPress={() => setIsEditingEmail(!isEditingEmail)} 
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  changePhotoButton: {
    flexDirection: 'row', // Garante alinhamento na mesma linha (Passo 5)
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 20,
  },
  changePhotoText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3C3C43',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  inputDisabled: {
    backgroundColor: '#EFEFF4',
    color: '#8E8E93',
  },
  charCount: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    textAlign: 'right',
  },
  buttonWrapper: {
    marginTop: 8,
  },
});