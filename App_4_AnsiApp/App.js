import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Telas
import HomeScreen from './src/screens/HomeScreen';
import BreathingScreen from './src/screens/BreathingScreen';
import TriggersScreen from './src/screens/TriggersScreen';
import WellnessScreen from './src/screens/WellnessScreen';
import MedicationScreen from './src/screens/MedicationScreen'; // Nova tela

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Componente que agrupa as telas da aba Bem-estar
function WellnessStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WellnessHome" component={WellnessScreen} />
      <Stack.Screen name="Medication" component={MedicationScreen} />
    </Stack.Navigator>
  );
}

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
        <Tab.Screen name="Bem-estar" component={WellnessStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}