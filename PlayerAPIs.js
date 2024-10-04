//Used for the Categories Spotify APIs

import { storeData, newUser } from './ExtraFunctions';

global.Buffer = require('buffer').Buffer;

//Retrieves the the playback state of the player returns the JSON. 
export async function getPlaybackState(){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
    }
    var playbackState = "";
    await fetch('https://api.spotify.com/v1/me/player', {
        method: "GET",
        headers:  {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
    .then((response) =>  response.json())
    .then((responseJson) => {
      playbackState = responseJson
    })
    .catch((error) => {
      console.error(error);
    })
    return playbackState
}

//Function to calla GET API to retrieve devices.  Currently only retrieves the first device.
//But we will add functionality later to choose device;
export async function getPlayer(){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
     }
    fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: {
        'Authorization': "Bearer " + newUser.getAccessToken(),
      }
    })
    .then((response) =>  response.json())
    .then((responseJson) => {
      newUser.setCurrentPlayer(responseJson.devices[0].id);
      storeData(newUser.getUserName(), JSON.stringify(newUser))
      //need to send an alert if spotify device is not running. 
    })
    .catch((error) => {console.error(error); })
}

  //Function to call a POST API to tell the player to go to the next song. 
export const nextSong = async () => {
    if(Date.now()  > newUser.getExpiresIn()){
       refreshUserToken()
    }
    fetch('https://api.spotify.com/v1/me/player/next?device_id=' + newUser.getCurrentPlayer(), {
      method: "POST",
      headers: {
        'Authorization': "Bearer " + newUser.getAccessToken(),
      }  
    })
    .catch((error) => {console.error(error)})
}

//Retrieves the currently playing track of the player returns the JSON. 
export async function getCurrentlyPlayingTrack(){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
    }
    var currentlyPlayingTrack = "";
    await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        method: "GET",
        headers:  {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
    .then((response) =>  response.json())
    .then((responseJson) => {
      currentlyPlayingTrack = responseJson
    })
    .catch((error) => {
      console.error(error);
    })
    return currentlyPlayingTrack
}

//Starts playback based on the sent URI during the call. 
export async function startResumePlayback(uri){
  if(Date.now()  > newUser.getExpiresIn()){
    refreshUserToken()
  }
  var bodyString = ""
  //If no URI is sent. The playback is started from pause.
  if( uri == null){
    bodyString = {}
  }
  //If the 9th element of the uri is T, that means the uri is a track, and the body of the put will need "uris" in the body.
  else if(uri[8] == "t"){
    bodyString = {"uris": [uri], 
    }
  }
  //If uri is sent, but not a track, "contest_uri" is needed in the put body. 
  else if( uri != null){
    bodyString = {
        "context_uri": uri
    }
  }
  fetch("https://api.spotify.com/v1/me/player/play?device_id=" + newUser.getCurrentPlayer(), {
    method: "PUT",
    headers: {
      'Authorization': "Bearer " + newUser.getAccessToken(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyString)
  }) 
  .then((response) =>  console.log(response))
  .catch((error) => {
    console.error(error);
  })
}

//Pauses playback of the player. 
export async function pausePlayback(){
  if(Date.now()  > newUser.getExpiresIn()){
    refreshUserToken()
  }
  fetch("https://api.spotify.com/v1/me/player/pause?device_id=" + newUser.getCurrentPlayer(), {
    method: "PUT",
    headers: {
    'Authorization': "Bearer " + newUser.getAccessToken(),
    'Content-Type': 'application/json'
    },
  }) 
  .then((response) =>  console.log(response))      
  .catch((error) => {
    console.error(error);
  })
}

//Put to set the position of the track based on ms time.
export async function seekToPosition(time){
  if(Date.now()  > newUser.getExpiresIn()){
    refreshUserToken()
  }
  fetch("https://api.spotify.com/v1/me/player/seek?device_id=" + newUser.getCurrentPlayer() + "&position_ms=" + time , {
    method: "PUT",
    headers: {
      'Authorization': "Bearer " + newUser.getAccessToken(),
      'Content-Type': 'application/json'
    },
  }) 
  .then((response) =>  console.log(response))
  .catch((error) => {
    console.error(error);
  })
}

//Sets player to previous song. 
export async function skipToPrevious() {
  if(Date.now()  > newUser.getExpiresIn()){
     refreshUserToken()
  }
  fetch('https://api.spotify.com/v1/me/player/previous?device_id=' + newUser.getCurrentPlayer(), {
    method: "POST",
    headers: {
      'Authorization': "Bearer " + newUser.getAccessToken(),
    }  
  })
  .catch((error) => {console.error(error)})
}

//Put to set Repeat mode of the player. 
//for context
//'track' will repeate  the current track
//'context' will repate the current context
//'off' will turn repeat off
export async function setRepeatMode(context) {
  if(Date.now()  > newUser.getExpiresIn()){
     refreshUserToken()
  }
  fetch('https://api.spotify.com/v1/me/player/repeat?device_id=' + newUser.getCurrentPlayer() + '&state=' + context, {
    method: "PUT",
    headers: {
      'Authorization': "Bearer " + newUser.getAccessToken(),
    }  
  })
  .catch((error) => {console.error(error)})
}

//Sets volume percentage of the player. 
//Does not work with mobile. 
//I do not suggest we try to use this.
export async function setPlaybackVolume(volumePercent) {
  if(Date.now()  > newUser.getExpiresIn()){
     refreshUserToken()
  }
  fetch('https://api.spotify.com/v1/me/player/volume?device_id=' + newUser.getCurrentPlayer() + '&volume_percent=' + volumePercent, {
    method: "PUT",
    headers: {
      'Authorization': "Bearer " + newUser.getAccessToken(),
    }  
  })
  .catch((error) => {console.error(error)})
}

//Put to set the Shuffle on the player. 
//for context
//'true' shuffle user's playback
//'false' Do not shuffle user's playback
export async function togglePlaybackShuffle(context) {
  if(Date.now()  > newUser.getExpiresIn()){
     refreshUserToken()
  }
  fetch('https://api.spotify.com/v1/me/player/shuffle?device_id=' + newUser.getCurrentPlayer() + '&state=' + context, {
    method: "PUT",
    headers: {
      'Authorization': "Bearer " + newUser.getAccessToken(),
    }  
  })
  .catch((error) => {console.error(error)})
}

//Retrieves the User's current queue returns the JSON. 
export async function getTheUsersQueue(){
  if(Date.now()  > newUser.getExpiresIn()){
      refreshUserToken()
  }
  await fetch('https://api.spotify.com/v1/me/player/queue', {
      method: "GET",
      headers:  {
          'Authorization': "Bearer " + newUser.getAccessToken(),
      }
  })
  .then((response) =>  response.json())
  .then((responseJson) => {
    usersQueue = responseJson
  })
  .catch((error) => {
    console.error(error);
  })
  return usersQueue
}



