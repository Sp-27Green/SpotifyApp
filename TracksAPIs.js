//Used for the Tracks Spotify APIs

import { newUser } from './ExtraFunctions';

//Retrieves the track based on the track ID, and returns the JSON. 
export async function getTrack(trackID){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
    }
    await fetch('https://api.spotify.com/v1/tracks/' + trackID, {
        method: "GET",
        headers:  {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
    .then((response) =>  response.json())
    .then((responseJson) => {
      trackJSON = responseJson
    })
    .catch((error) => {
      console.error(error);
    })
    return trackJSON
}

//Retrieves several tracks based on the track ID string, and returns the JSON. 
//track IDs in string must be separated by %2C to represent commas, or commas. 
export async function getSeveralTracks(trackIDString){
  if(Date.now()  > newUser.getExpiresIn()){
      refreshUserToken()
  }
  await fetch('https://api.spotify.com/v1/tracks?ids=' + trackIDString, {
      method: "GET",
      headers:  {
          'Authorization': "Bearer " + newUser.getAccessToken(),
      }
  })
  .then((response) =>  response.json())
  .then((responseJson) => {
    trackJSON = responseJson
  })
  .catch((error) => {
    console.error(error);
  })
  return trackJSON
}

//Retrieves the user's saved tracks, and returns the JSON. 
export async function getUsersSavedTracks(){
  if(Date.now()  > newUser.getExpiresIn()){
      refreshUserToken()
  }
  await fetch('https://api.spotify.com/v1/me/tracks', {
      method: "GET",
      headers:  {
          'Authorization': "Bearer " + newUser.getAccessToken(),
      }
  })
  .then((response) =>  response.json())
  .then((responseJson) => {
    trackJSON = responseJson
  })
  .catch((error) => {
    console.error(error);
  })
  return trackJSON
}

//Retrieves several tracks audio features based on the tracks ID string, and returns the JSON.  Needed to get tempo and energy. 
//track IDs in string must be separated by %2C to represent commas, or just commas. 
export async function getSeveralTracksAudioFeatures(trackIDString){
  if(Date.now()  > newUser.getExpiresIn()){
      refreshUserToken()
  }
  await fetch('https://api.spotify.com/v1/audio-features?ids=' + trackIDString, {
      method: "GET",
      headers:  {
          'Authorization': "Bearer " + newUser.getAccessToken(),
      }
  })
  .then((response) =>  response.json())
  .then((responseJson) => {
    trackJSON = responseJson
  })
  .catch((error) => {
    console.error(error);
  })
  return trackJSON
}

//Retrieves a single track's audio feature, and returns the JSON. Needed to get tempo and energy. 
export async function getTracksAudioFeatures(trackID){
  if(Date.now()  > newUser.getExpiresIn()){
      refreshUserToken()
  }
  await fetch('https://api.spotify.com/v1/audio-features/' + trackID, {
      method: "GET",
      headers:  {
          'Authorization': "Bearer " + newUser.getAccessToken(),
      }
  })
  .then((response) =>  response.json())
  .then((responseJson) => { 
    trackJSON = responseJson
  })
  .catch((error) => {
    console.error(error);
  })
  return trackJSON
}

