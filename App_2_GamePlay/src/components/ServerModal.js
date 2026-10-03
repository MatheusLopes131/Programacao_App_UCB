import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  FlatList, 
  Image 
} from 'react-native';

// Dados simulados (poderiam vir do backend)
const servers = [
  { id: '1', gameImage: require('../../assets/csgo.png'), title: 'Rumo ao topo', category: 'Administrador' },
  { id: '2', gameImage: require('../../assets/apex.png'), title: 'Bora queimar tudo', category: 'Convidado' },
  { id: '3', gameImage: require('../../assets/lol.png'), title: 'Yeah, Boy', category: 'Convidado' },
  { id: '4', gameImage: require('../../assets/valorant.png'), title: 'Valorosos', category: 'Convidado' },
  { id: '5', gameImage: require('../../assets/red_dead.png'), title: 'Rolezinho Monstro', category: 'Convidado' },
  { id: '6', gameImage: require('../../assets/lol.png'), title: 'Construtores', category: 'Convidado' },
];

export default function ServerModal({ visible, onClose, onSelect }) {
  return (
    <>
      <Modal
        transparent={true}
        visible={visible}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            {/* Cabeçalho do Modal */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Selecione um servidor</Text>
            </View>

            {/* Lista de Servidores */}
            <FlatList
              data={servers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.serverItem} 
                  onPress={() => onSelect(item)}
                >
                  <Image source={item.gameImage} style={styles.serverImage} />
                  <View style={styles.serverInfo}>
                    <Text style={styles.serverTitle}>{item.title}</Text>
                    <Text style={styles.serverCategory}>{item.category}</Text>
                  </View>
                  <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: '#1C1C2E',
    borderRadius: 8,
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  serverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C3E',
  },
  serverImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  serverInfo: {
    flex: 1,
    marginLeft: 12,
  },
  serverTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  serverCategory: {
    color: '#B0B0C3',
    fontSize: 12,
  },
  arrow: {
    color: '#B0B0C3',
    fontSize: 24,
  }
});