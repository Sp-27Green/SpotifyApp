import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import PlayerScreen from './src/PlayerScreen';  // Import the Player screen
import SearchScreen from './src/SearchScreen';  // Import the Search screen
import PlaylistScreen from './src/PlaylistScreen';  // Import the Playlist screen
import LoginScreen from './src/LoginScreen';  // Import the Login screen
import { TemplateScreen } from './src/TemplateScreen';
import { TempofyScreen } from './src/TempofyScreen';
import { Ionicons } from '@expo/vector-icons'; // For tab icons

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if the user is logged in

  // Tab Navigator for the player, search, and playlist screens
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
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Playlist" component={PlaylistScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
