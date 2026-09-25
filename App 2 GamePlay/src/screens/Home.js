import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  StatusBar,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Background from '../components/Background';
import CategoryCard from '../components/CategoryCard';
import AppointmentCard from '../components/AppointmentCard';
import ExitModal from '../components/ExitModal';

// Dados simulados para as categorias
const categories = [
  { id: '1', title: 'Ranqueada', icon: '🏆' },
  { id: '2', title: 'Duelo 1x1', icon: '⚔️' },
  { id: '3', title: 'Diversão', icon: '🤡' },
  { id: '4', title: 'Treino', icon: '🎯' },
];

// Dados simulados para as partidas agendadas
const appointments = [
  {
    id: '1',
    gameImage: require('../../assets/lol.png'),
    title: 'Lendários',
    date: '18/06',
    time: '21:00h',
    category: 'Ranqueada',
    role: 'Anfitrião',
  },
  {
    id: '2',
    gameImage: require('../../assets/csgo.png'),
    title: 'Yeah, boy',
    date: '23/06',
    time: '19:00h',
    category: 'Diversão',
    role: 'Visitante',
  },
  {
    id: '3',
    gameImage: require('../../assets/apex.png'),
    title: 'Rumo ao topo',
    date: '20/06',
    time: '09:00h',
    category: '1x1',
    role: 'Anfitrião',
  },
  {
    id: '4',
    gameImage: require('../../assets/red_dead.png'),
    title: 'Bora queimar tudo',
    date: '20/06',
    time: '14:20h',
    category: 'Ranqueada',
    role: 'Anfitrião',
  },
  {
    id: '5',
    gameImage: require('../../assets/valorant.png'),
    title: 'Valorosos',
    date: '20/06',
    time: '14:20h',
    category: 'Diversão',
    role: 'Anfitrião',
  },
];

export default function Home() {
  const navigation = useNavigation();
  const [exitModalVisible, setExitModalVisible] = useState(false);

  return (
    <Background>
      <StatusBar barStyle="light-content" backgroundColor="#0D0E22" />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho com Perfil */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            {/* Avatar atualizado para jogador_1.png */}
            <Image 
              source={require('../../assets/jogador_1.png')} 
              style={styles.avatar} 
            />
            <View style={styles.profileText}>
              {/* Nome atualizado para Patrick */}
              <Text style={styles.greeting}>Olá, Patrick</Text>
              <Text style={styles.subGreeting}>Hoje é dia de vitória</Text>
            </View>
          </View>
          
          {/* Botões da direita (Sair e Adicionar) */}
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.exitButton} 
              onPress={() => setExitModalVisible(true)}
            >
              <Text style={styles.exitButtonText}>⏻</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('AppointmentCreate')}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista Horizontal de Categorias */}
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryCard title={item.title} icon={item.icon} />
          )}
          contentContainerStyle={styles.categoriesList}
        />

        {/* Título da Seção */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Partidas agendadas</Text>
          <Text style={styles.sectionTotal}>Total {appointments.length}</Text>
        </View>

        {/* Lista Vertical de Partidas */}
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('AppointmentDetails', { appointment: item })}
            >
              <AppointmentCard 
                gameImage={item.gameImage}
                title={item.title}
                date={item.date}
                time={item.time}
                category={item.category}
                role={item.role}
              />
            </TouchableOpacity>
          )}
          scrollEnabled={false} 
          contentContainerStyle={styles.appointmentsList}
        />

      </ScrollView>

      {/* Modal de Saída */}
      <ExitModal 
        visible={exitModalVisible}
        onClose={() => setExitModalVisible(false)}
        onConfirm={() => {
          alert('Saindo do GamePlay...');
        }}
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
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#E51C44',
  },
  profileText: {
    marginLeft: 12,
  },
  greeting: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subGreeting: {
    color: '#B0B0C3',
    fontSize: 13,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exitButton: {
    marginRight: 12,
    padding: 8,
  },
  exitButtonText: {
    color: '#FFF',
    fontSize: 20,
  },
  addButton: {
    backgroundColor: '#E51C44',
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: -2,
  },
  categoriesList: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTotal: {
    color: '#B0B0C3',
    fontSize: 14,
  },
  appointmentsList: {
    paddingBottom: 40,
  }
});