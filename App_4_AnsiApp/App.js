import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importando as telas
import HomeScreen from './src/screens/HomeScreen';
import BreathingScreen from './src/screens/BreathingScreen';
import TriggersScreen from './src/screens/TriggersScreen';
import WellnessScreen from './src/screens/WellnessScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#6C63FF',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Início') iconName = 'home';
            else if (route.name === 'Respiração') iconName = 'leaf';
            else if (route.name === 'Gatilhos') iconName = 'book';
            else if (route.name === 'Bem-estar') iconName = 'heart';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Início" component={HomeScreen} />
        <Tab.Screen name="Respiração" component={BreathingScreen} />
        <Tab.Screen name="Gatilhos" component={TriggersScreen} />
        <Tab.Screen name="Bem-estar" component={WellnessScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}