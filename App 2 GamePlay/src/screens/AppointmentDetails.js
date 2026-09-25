import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  StatusBar,
  ScrollView,
  FlatList
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Background from '../components/Background';

// Dados simulados dos jogadores usando as imagens que você adicionou
const players = [
  { 
    id: '1', 
    name: 'Patrick Estrela', 
    role: 'Anfitrião', 
    avatar: require('../../assets/jogador_1.png') 
  },
  { 
    id: '2', 
    name: 'Bob Esponja', 
    role: 'Convidado', 
    avatar: require('../../assets/jogador_2.png') 
  },
  { 
    id: '3', 
    name: 'Lula Molusco', 
    role: 'Convidado', 
    avatar: require('../../assets/jogador_3.png') 
  },
];

export default function AppointmentDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Pega os dados da partida que vieram da Home (ou usa dados padrão)
  const appointment = route.params?.appointment || {
    title: 'Lendários',
    description: 'É hora de chamar os challengers para perder uma partida da ranked',
    banner: require('../../assets/banner.png'), // Imagem padrão caso não venha nada
  };

  // Se a partida veio da Home, ela tem "gameImage", então usamos como banner.
  // Se não, usamos o banner padrão.
  const bannerImage = appointment.gameImage || require('../../assets/banner.png');

  return (
    <Background>
      <StatusBar barStyle="light-content" backgroundColor="#0D0E22" />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Banner do Jogo */}
        <Image 
          source={bannerImage} 
          style={styles.banner} 
          resizeMode="cover"
        />

        {/* Título e Descrição */}
        <Text style={styles.title}>{appointment.title}</Text>
        <Text style={styles.description}>{appointment.description}</Text>

        {/* Lista de Jogadores */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Jogadores</Text>
          <Text style={styles.sectionTotal}>Total {players.length}</Text>
        </View>

        <FlatList
          data={players}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.playerItem}>
              <Image source={item.avatar} style={styles.playerAvatar} />
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{item.name}</Text>
                <Text style={styles.playerRole}>{item.role}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.playersList}
        />

        {/* Botão Entrar na Partida */}
        <TouchableOpacity style={styles.enterButton}>
          <Text style={styles.enterButtonText}>Entrar na partida</Text>
        </TouchableOpacity>

      </ScrollView>
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
    marginBottom: 20,
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
  closeButton: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  banner: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#B0B0C3',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  playersList: {
    marginBottom: 24,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C2E',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E51C44',
  },
  playerInfo: {
    marginLeft: 12,
  },
  playerName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  playerRole: {
    color: '#B0B0C3',
    fontSize: 12,
  },
  enterButton: {
    backgroundColor: '#E51C44',
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  enterButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});