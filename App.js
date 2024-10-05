//Muhammad Testing
//Marc Testing

//Updated Nothing much to see, and we can change it and clean it up.  Just be careful with the login. 

import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {useAuthRequest } from 'expo-auth-session';
import {StyleSheet, Button, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { newUser } from './ExtraFunctions';
import { authorize } from './LoginFunctions';
import { nextSong, startResumePlayback, pausePlayback, getTheUsersQueue } from './PlayerAPIs';
import { search } from './SearchAPIs';
import { getPlaylistCoverImage } from './PlaylistsAPIs';
import { getNewReleases } from './AlbumAPIs';
import { getArtistsRelatedArtists } from './ArtistsAPIs';
import { getSingleBrowseCategories } from './CategoriesAPIs';
import { getTracksAudioFeatures } from './TracksAPIs';
import { getFollowedArtists } from './UserAPIs';

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
      scopes: ["user-follow-read, user-read-private, user-read-email, app-remote-control, streaming, user-read-playback-state, user-modify-playback-state, user-read-currently-playing, playlist-read-private, user-library-read, user-top-read"],
      // To follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: discovery.redirectUri,
    },
    discovery
  );
  //Use effect to check response. If a success, retrieve the user token. 
  useEffect(() => {
    async function login(){
      if (response?.type === 'success') {
        const { code } = response.params;
        var responseCode = response.params.code;
        var querystring = require('querystring');
        await authorize(querystring, responseCode);
        
        await setState("Logged in as: " + await newUser.getUserName());

      
      
    }
  }
  login()
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
      <Button 
        title = "pause"
        onPress={ () => {
        pausePlayback()
        }}
      />
      <Button 
        title = "get playlist"
        onPress={async  () => {
          var test = await getFollowedArtists()
          console.log(test)
        }}
      />

    
    </View>
    
    
    
  );
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


