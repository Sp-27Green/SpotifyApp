//Muhammad Test

import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { GrantType, makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import {StyleSheet, Button, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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


//Login page for app
export default function App() {
  //State to hold the text for login page. 
  const [myState, setState] = useState("Not logged in");
  //Use OAuth.  I may want to switch this to Auth PKCE later since its more secure.
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: clientInfo.clientId,
      scopes: ["user-read-private, user-read-email, app-remote-control, streaming, user-read-playback-state, user-modify-playback-state, user-read-currently-playing"],
      // To follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: discovery.redirectUri,
    },
    discovery
  );
  //Use effect to check response. If a success, retrieve the user token. 
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      var responseCode = response.params.code;
      var querystring = require('querystring');
      console.log(response.params.code)

      //Retrieve user token curl call. 
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
        console.log(responseJson)
        AsyncStorage.setItem("accessToken", responseJson["access_token"])
        AsyncStorage.setItem("refreshToken", responseJson["refresh_token"])
        AsyncStorage.setItem("expireIn", Date.now + responseJson["expires_in"])
      })
      //Curl command to retrieve user info and adds it to the state. 
      const getUserInfo =  async() =>{
        const accessToken = await AsyncStorage.getItem("accessToken")
        fetch('https://api.spotify.com/v1/me', {
          method: "Get",
          headers: {
            'Authorization': "Bearer " + accessToken,
          }
        })
        .then((response) =>  response.json())
        .then((responesJson) => {
          setState("Logged in as: " + responesJson["display_name"])
        })
        .catch((error) => {
          console.error(error);
        })
      }
      //Calls function to get user info.
      getUserInfo()
      .catch((error) => {
        console.error(error);
      });
    }
  }, [response]);
  console.log(response)

  //The page. 
  return (
    <View style={styles.container}>
      <Text>{myState}</Text>
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync();
        }}
      />
      <Button 
        title = "Next Song"
        onPress={() => {
         nextSong()
        }}
      />
    </View>
  );
}


//Function to call a POST API to tell the player to go to the next song. 
const nextSong = async () => {
  //Call function to get player info
  getPlayer()
  const playerID = await AsyncStorage.getItem("player");
  const accessToken = await AsyncStorage.getItem("accessToken")
  fetch('https://api.spotify.com/v1/me/player/next?device_id=' + playerID, {
    method: "POST",
    headers: {
      'Authorization': "Bearer " + accessToken,
    }  
  })
  .then((response) =>  console.log(response))
  .catch((error) => {console.error(error)})
}

//Function to calla GET API to retrieve devices.  Currently only retrieves the first device.
//But we will add functionality later to choose device;
const getPlayer = async() => {
  if(await AsyncStorage.getItem("player")){

  }
  else{
  const accessToken = await AsyncStorage.getItem("accessToken")
  fetch('https://api.spotify.com/v1/me/player/devices', {
    headers: {
      'Authorization': "Bearer " + accessToken,
    }
  })
  .then((response) =>  response.json())
  .then((responseJson) => {
    console.log(responseJson.devices[0].id)
    if(responseJson[0] != null){
      AsyncStorage.setItem("player", responseJson.devices[0].id)
      console.log(responseJson.devices[0].id)
    }
    
    //need to send an alert if spotify device is not running. 
  })
  .catch((error) => {console.error(error); })
}
}






//Styles that can be updated. 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10,
  },
  text: {
   borderWidth: 1,
   padding: 25,
   borderColor: 'black',
   backgroundColor: 'red'
},
box: {
   backgroundColor: 'blue',
   width: 50,
   height: 100
}
  
});
