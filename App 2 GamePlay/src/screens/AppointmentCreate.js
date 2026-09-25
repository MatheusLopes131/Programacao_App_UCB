import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  StatusBar,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Background from '../components/Background';
import CategoryCard from '../components/CategoryCard';
import ServerModal from '../components/ServerModal';

const categories = [
  { id: '1', title: 'Ranqueada', icon: '🏆' },
  { id: '2', title: 'Duelo 1x1', icon: '⚔️' },
  { id: '3', title: 'Diversão', icon: '🤡' },
];

export default function AppointmentCreate() {
  const navigation = useNavigation();
  
  // Estados da tela
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [description, setDescription] = useState('');

  function handleSelectServer(server) {
    setSelectedServer(server);
    setModalVisible(false);
  }

  function handleSchedule() {
    if (!selectedCategory || !selectedServer || !day || !hour) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
    alert(`Partida agendada com sucesso!\nCategoria: ${selectedCategory.title}\nServidor: ${selectedServer.title}\nData: ${day}/${month} às ${hour}:${minute}`);
    navigation.goBack(); // Volta para a Home
  }

  return (
    <Background>
      <StatusBar barStyle="light-content" backgroundColor="#0D0E22" />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agendar partida</Text>
          <View style={{ width: 24 }} /> {/* Espaçador */}
        </View>

        {/* Seção Categoria */}
        <Text style={styles.sectionLabel}>Categoria</Text>
        <View style={styles.categoriesContainer}>
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              onPress={() => setSelectedCategory(cat)}
            >
              <View style={[
                styles.categoryWrapper,
                selectedCategory?.id === cat.id && styles.categorySelected
              ]}>
                <CategoryCard title={cat.title} icon={cat.icon} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão Selecionar Servidor */}
        <TouchableOpacity 
          style={styles.serverButton} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.serverButtonText}>
            {selectedServer ? selectedServer.title : 'Selecione um servidor'}
          </Text>
          <Text style={styles.serverButtonArrow}>›</Text>
        </TouchableOpacity>

        {/* Seção Data e Hora */}
        <View style={styles.dateTimeSection}>
          <View style={styles.dateTimeGroup}>
            <Text style={styles.sectionLabel}>Dia e mês</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.smallInput}
                placeholder="DD"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={2}
                value={day}
                onChangeText={setDay}
              />
              <Text style={styles.separator}>/</Text>
              <TextInput
                style={styles.smallInput}
                placeholder="MM"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={2}
                value={month}
                onChangeText={setMonth}
              />
            </View>
          </View>

          <View style={styles.dateTimeGroup}>
            <Text style={styles.sectionLabel}>Horário</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.smallInput}
                placeholder="HH"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={2}
                value={hour}
                onChangeText={setHour}
              />
              <Text style={styles.separator}>:</Text>
              <TextInput
                style={styles.smallInput}
                placeholder="MM"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={2}
                value={minute}
                onChangeText={setMinute}
              />
            </View>
          </View>
        </View>

        {/* Seção Descrição */}
        <View style={styles.descriptionContainer}>
          <View style={styles.descriptionHeader}>
            <Text style={styles.sectionLabel}>Descrição</Text>
            <Text style={styles.charCount}>Max 100 caracteres</Text>
          </View>
          <TextInput
            style={styles.descriptionInput}
            multiline
            numberOfLines={4}
            maxLength={100}
            placeholder="É hora de chamar os challengers para perder uma partida da ranked"
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Botão Agendar */}
        <TouchableOpacity style={styles.scheduleButton} onPress={handleSchedule}>
          <Text style={styles.scheduleButtonText}>Agendar</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Modal de Servidor */}
      <ServerModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleSelectServer}
      />
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  categorySelected: {
    borderWidth: 2,
    borderColor: '#E51C44',
  },
  serverButton: {
    backgroundColor: '#1C1C2E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#E51C44',
  },
  serverButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  serverButtonArrow: {
    color: '#B0B0C3',
    fontSize: 24,
  },
  dateTimeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dateTimeGroup: {
    flex: 1,
    marginRight: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallInput: {
    backgroundColor: '#1C1C2E',
    color: '#FFF',
    width: 50,
    height: 50,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  charCount: {
    color: '#666',
    fontSize: 12,
  },
  descriptionInput: {
    backgroundColor: '#1C1C2E',
    color: '#FFF',
    borderRadius: 8,
    padding: 16,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  scheduleButton: {
    backgroundColor: '#E51C44',
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  scheduleButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});