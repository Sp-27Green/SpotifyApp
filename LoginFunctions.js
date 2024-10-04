//Moves most of the login functions to this file. 
import * as WebBrowser from 'expo-web-browser';
import { getPlayer } from './PlayerAPIs';
import { newUser } from './ExtraFunctions';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
  redirectUri: 'exp://localhost:19000'
};

//Add your client ID and secret from Spotify developers
const clientInfo = {
  clientId: '90e7fc0da38d469986e5efa95f914320',
  clientSecret: "3b852e81cc764ef8b8f5c123efb9e415"
}

//Authorize function calls the token enpoint to get authorization. 
export function authorize(querystring, responseCode){
    
    fetch('https://accounts.spotify.com/api/token', {
        method: "POST",
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: querystring.stringify ({
          code: responseCode,
          grant_type: 'authorization_code',
          redirect_uri: discovery.redirectUri,
          client_id: clientInfo.clientId,
          client_secret: clientInfo.clientSecret
        })
      })
    //Retrieve JSON, then stores the accessToken, refreshToken, and expire time in Async storage so it can be used later. 
      .then((response) => response.json())
      .then((responseJson) => {
        newUser.setAccessToken(responseJson["access_token"])
        newUser.setRefreshToken(responseJson["refresh_token"])
        newUser.setExpiresIn(Date.now() + (responseJson["expires_in"] * 1000))
        setUserInfo()
      }) 
}

//Retrieves user info and gets player info right after login.
const setUserInfo = () =>{
    fetch('https://api.spotify.com/v1/me', {
      method: "Get",
      headers: {
        'Authorization': "Bearer " + newUser.getAccessToken(),
      }
    })
    .then((response) =>  response.json())
    .then((responseJson) => {
      newUser.setUserName(responseJson["display_name"])
      getPlayer()      
    })
    .catch((error) => {
      console.error(error);
    })
  }

  //refresh token endpoint when the refresh time has ended. 
export function refreshUserToken() {
    var querystring = require('querystring');
    var refresh_token = newUser.getRefreshToken();
    fetch('https://accounts.spotify.com/api/token',{
        method: "POST",
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(clientInfo.clientId + ':' + clientInfo.clientSecret).toString('base64'))
          },
          body: querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
        newUser.setAccessToken(responseJson.access_token);
        newUser.setExpiresIn(Date.now() + (responseJson.expires_in * 1000))
        if(responseJson.hasOwnProperty(refresh_token)){
            newUser.setRefreshToken(responseJson.refresh_token);
        }
    })
  }

  