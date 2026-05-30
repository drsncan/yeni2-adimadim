// @ts-nocheck
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';

// Ekranların İçe Aktarımı
import HomeScreen from './screens/HomeScreen';
import FocusScreen from './screens/FocusScreen';
import StatsScreen from './screens/StatsScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  let emoji = '🏠';
  if (label === 'Focus') emoji = '⏱️';
  if (label === 'Stats') emoji = '📈';
  if (label === 'Profile') emoji = '👤';

  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.iconText, focused && styles.iconTextActive]}>{emoji}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#FF8906',
          tabBarInactiveTintColor: '#8F8F9F',
          tabBarStyle: {
            backgroundColor: '#1E1F29',
            borderTopColor: '#2D2D3D',
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
          tabBarIcon: ({ focused }) => {
            return <TabIcon label={route.name} focused={focused} />;
          },
        })}
      >
        <Tab.Screen 
          name="Ana Sayfa" 
          component={HomeScreen} 
          options={{ title: 'Ana Sayfa' }}
        />
        <Tab.Screen 
          name="Odaklanma" 
          component={FocusScreen} 
          options={{ title: 'Odak' }}
        />
        <Tab.Screen 
          name="İstatistikler" 
          component={StatsScreen} 
          options={{ title: 'Analiz' }}
        />
        <Tab.Screen 
          name="Profil" 
          component={ProfileScreen} 
          options={{ title: 'Profil' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
    opacity: 0.5,
  },
  iconTextActive: {
    opacity: 1,
  },
});
