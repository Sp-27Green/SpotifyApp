import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Buffer } from 'buffer';
import { useNavigation } from '@react-navigation/native';
import { newUser } from '../ExtraFunctions';
import { getUserInfo } from '../LoginFunctions';

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const clientInfo = {
  clientId: '63f3a6f0286e4f7a9e2c30ac0f90ea49', // Your clientId
  clientSecret: '13fb075c2ff549e6aa9f0d85e77b1476', // Your clientSecret
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ setIsLoggedIn }) {
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [myState, setState] = useState('Not logged in');

  const navigation = useNavigation();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: clientInfo.clientId,
      scopes: ['user-follow-read, user-read-private, user-read-email, app-remote-control, streaming, user-read-playback-state, user-modify-playback-state, user-read-currently-playing, playlist-read-private, playlist-modify-public, playlist-modify-private, user-library-read, user-top-read'],
      redirectUri: 'exp://192.168.1.7:8081',
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
        newUser.setAccessToken(responseJson.access_token);
        newUser.setRefreshToken(responseJson.refresh_token);
        newUser.setExpiresIn(Date.now() + responseJson.expires_in * 1000);
        getUserInfo(); // Fetch user info after getting the token

        if (token) {
          setAccessToken(token);
          fetchUserProfile(token);
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
        setIsLoggedIn(true);
      })
      .catch((error) => {
        console.error('Error fetching user info:', error);
      })
      .finally(() => setLoading(false));
  };

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
