import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Buffer } from 'buffer';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const clientInfo = {
  clientId: '63f3a6f0286e4f7a9e2c30ac0f90ea49', // Change your clientId. this is mine
  clientSecret: '13fb075c2ff549e6aa9f0d85e77b1476', // Change your clientSecret. this is also mine
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ setIsLoggedIn }) {
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [myState, setState] = useState("Not logged in");

  const navigation = useNavigation(); // Initialize the navigation

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: clientInfo.clientId,
      scopes: ['user-read-email', 'user-read-private'],
      redirectUri: makeRedirectUri({ scheme: 'tempoflow' }), // Adjust the scheme here as per your setup, I added URIs to my website
      usePKCE: true,
    },
    discovery
  );

  const handleTokenExchange = async (code) => {
    setLoading(true);
    const querystring = require('querystring');

    if (!request?.codeVerifier) {
      console.error('Code verifier not found.');
      return;
    }

    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(clientInfo.clientId + ':' + clientInfo.clientSecret).toString('base64'),
      },
      body: querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: makeRedirectUri({ scheme: 'tempoflow' }),
        code_verifier: request.codeVerifier,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        const token = responseJson.access_token;

        if (token) {
          setAccessToken(token);
          fetchUserProfile(token); // Fetch user profile after getting the token
        } else {
          console.error('No access token found in response:', responseJson);
        }
      })
      .catch((error) => {
        console.error('Error exchanging token:', error);
      })
      .finally(() => setLoading(false));
  };

  const fetchUserProfile = async (token) => {
    setLoading(true);
    fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserInfo(data);
        setState('Logged in as: ' + data.display_name);

        // Set login state to true
        setIsLoggedIn(true);
      })
      .catch((error) => {
        console.error('Error fetching user info:', error);
      })
      .finally(() => setLoading(false));
  };

  // Monitor the response from the OAuth request
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      handleTokenExchange(code);
    }
  }, [response]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Tempoflow</Text>

      {userInfo ? (
        <View>
          <Text style={styles.welcomeText}>{myState}</Text>
          <Text style={styles.emailText}>Email: {userInfo.email}</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.loginButton}
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        >
          <Text style={styles.loginButtonText}>Login with Spotify</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
    color: '#AAAAAA',
  },
  loginButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 20,
  },
  loginButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
