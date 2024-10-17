import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import PlayerScreen from './src/PlayerScreen';  
import SearchScreen from './src/SearchScreen';  
import TempofyScreen from './src/TempofyScreen';
import TemplateScreen from './src/TemplateScreen';
import PlaylistScreen from './src/PlaylistScreen';  
import LoginScreen from './src/LoginScreen';  
import { Ionicons } from '@expo/vector-icons'; 

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks if the user is logged in

  // Tab Navigator for the player, search, playlist, and tempofy screens
  const TabNavigator = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Player') {
            iconName = 'musical-notes';
          } else if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Playlist') {
            iconName = 'list';
          } else if (route.name === 'Tempofy') {
            iconName = 'timer-outline'; // Change icon as needed
          }

          // Return the appropriate icon
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1DB954',  // Set active icon color
        tabBarInactiveTintColor: '#AAAAAA',  // Set inactive icon color
        tabBarStyle: { backgroundColor: '#1E1E1E' },  // Customize tab bar background
      })}
    >
      <Tab.Screen name="Player" component={PlayerScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Playlist" component={PlaylistScreen} />
      <Tab.Screen name="Tempofy" component={TempofyScreen} />
      <Tab.Screen name="Template" component={TemplateScreen} />

    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          // If logged in, show the TabNavigator
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          // Otherwise, show the LoginScreen
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
          >
            {props => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
