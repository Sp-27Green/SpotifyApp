import * as WebBrowser from 'expo-web-browser';
import { getPlayer } from './PlayerAPIs';
import { newUser } from './ExtraFunctions';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
  redirectUri: 'exp://192.168.1.12:8081',
};

// Add your client ID and secret from Spotify developers
const clientInfo = {
  clientId: '63f3a6f0286e4f7a9e2c30ac0f90ea49',
  clientSecret: '13fb075c2ff549e6aa9f0d85e77b1476',
};

// Authorize function calls the token endpoint to get authorization.
export function authorize(querystring, responseCode) {
  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      code: responseCode,
      grant_type: 'authorization_code',
      redirect_uri: discovery.redirectUri,
      client_id: clientInfo.clientId,
      client_secret: clientInfo.clientSecret,
    }),
  })
    // Retrieve JSON, then store the accessToken, refreshToken, and expire time
    .then((response) => response.json())
    .then((responseJson) => {
      newUser.setAccessToken(responseJson['access_token']);
      newUser.setRefreshToken(responseJson['refresh_token']);
      newUser.setExpiresIn(Date.now() + responseJson['expires_in'] * 1000);
      getUserInfo();
    })
    .catch((error) => {
      console.error(error);
    });
}

// Retrieves user info and gets player info right after login.
export const getUserInfo = () => {
  fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + newUser.getAccessToken(),
    },
  })
    .then((response) => response.json())
    .then((responseJson) => {
      newUser.setUserName(responseJson['display_name']);
      getPlayer();
    })
    .catch((error) => {
      console.error(error);
    });
};

// Refresh token endpoint when the refresh time has ended.
export function refreshUserToken() {
  const querystring = require('querystring');
  const refresh_token = newUser.getRefreshToken();
  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(clientInfo.clientId + ':' + clientInfo.clientSecret).toString('base64'),
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    }),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      newUser.setAccessToken(responseJson.access_token);
      newUser.setExpiresIn(Date.now() + responseJson.expires_in * 1000);
      if (responseJson.hasOwnProperty(refresh_token)) {
        newUser.setRefreshToken(responseJson.refresh_token);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
