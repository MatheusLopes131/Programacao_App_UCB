import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const navigation = useNavigation();

  function handleDiscordLogin() {
    navigation.navigate('Home');
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0E22" />
      
      <View style={styles.headerContainer}>
        {/* Imagem das Faixas Vermelhas */}
        <Image 
          source={require('../../assets/fundo-faixas.png')} 
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        {/* Imagem do Lutador */}
        <Image 
          source={require('../../assets/lutador.png')} 
          style={styles.fighterImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Conecte-se{'\n'}e organize suas{'\n'}jogatinas
        </Text>
        
        <Text style={styles.subtitle}>
          Crie grupos para jogar seus games{'\n'}favoritos com seus amigos
        </Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleDiscordLogin}
        >
          <View style={styles.discordIcon}>
             <Text style={{color: '#E51C44', fontWeight: 'bold'}}>#</Text>
          </View>
          <Text style={styles.buttonText}>Entrar com Discord</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0E22',
  },
  headerContainer: {
    width: '100%',
    height: '50%',
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  fighterImage: {
    width: '95%',
    height: '95%',
    zIndex: 2,
    marginBottom: -10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 16,
  },
  subtitle: {
    color: '#B0B0C3',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#E51C44',
    width: '100%',
    height: 56,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discordIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#FFF',
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  }
});