import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function AppointmentCard({ 
  gameImage, 
  title, 
  date, 
  time, 
  category, 
  role 
}) {
  return (
    <View style={styles.container}>
      <Image source={gameImage} style={styles.gameImage} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTime}>📅 {date} às {time}</Text>
        </View>
      </View>

      <View style={styles.rightContainer}>
        <Text style={styles.category}>{category}</Text>
        <View style={styles.roleContainer}>
          <Text style={styles.roleIcon}>{role === 'Anfitrião' ? '👑' : '👤'}</Text>
          <Text style={styles.roleText}>{role}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C2E',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#E51C44',
  },
  gameImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTime: {
    color: '#B0B0C3',
    fontSize: 13,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  category: {
    color: '#B0B0C3',
    fontSize: 12,
    marginBottom: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  roleText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  }
});