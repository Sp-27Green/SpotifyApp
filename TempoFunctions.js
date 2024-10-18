//Used for Creating the Tempofy playists. 

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from './SongClass';
import { newUser, intervalList, tempofyQueue } from './ExtraFunctions';
import {SongHashTable} from './HashTableClass'

export let newSongHashTable = new SongHashTable()
//tempofyList function starts the Tempofy process. 
//takes in the user's chosen Interval Template array as a parameter.
//Resets the
export  function tempofyList(chosenIntervalTemplate){
  return new Promise((resolve, reject) =>{
    //Resets the the tempfy queue and the hash table's songIndexCount. 
    //This is so the user can try different Interval Templates to create the playlist before fully creating the playlist. 
    tempofyQueue.songArray.length =  0;
    const resetCounnt =  newSongHashTable.resetCount();
    //The TempofyQueue function is called. 
    //This sends the hashTable and chosen Interval Template to the Tempo Queue object to start pulling songs into the queue based on the user's chosen Inteval Template. 
    const tempoQ =  tempofyQueue.retrieveSongs(newSongHashTable, chosenIntervalTemplate)
   if(tempoQ){
      resolve("true");
    }
    else{
      reject("false");
    }
  });   
}

//startHashTableFunction takes in the playlist ID or nothing.
//The functions creates the hashtable for the tempofy flow.  
export async function startHashTable(playlistID){
  //Resets global hashTable if it was used previously. 
  newSongHashTable =  new SongHashTable();
  //If the playlistID passed is not null, the function calls the getPlaylistSongs to call the API with playlist ID. 
  if(playlistID != 'queue'){
    await getPlaylistSongs(playlistID);  
  }
  //Else the getCurrentQueue funtion is called to pull the current queue to be inserted into the song hash table. 
  else{
    await getCurrentQueue();
  }
}

//getSongIDList function is used to create the songID string needed for the getAudio-Features api. 
//Paramater is used to determine if the originating list is pulled from a queue or playlist. 
//For loop is run to create the string, and then string is returned. 
async function getSongIDList(songListType, playlistItems){
  //Need to take out after testing. 
  console.log("getSongIDList parameter: " + playlistItems)
  var songIDString = "";
  playlistItems.forEach( async element => {
    if(songListType == "queue"){
      songIDString = songIDString + element.id + ",";
    }
    else if(songListType == "playlist"){
      songIDString = songIDString + element.track.id + ",";
    }
  })
  return songIDString
}

//Function to get the playlist using the playlistID by calling the getPlaylist API.
async function getPlaylistSongs(playlistID){
  if(Date.now()  > newUser.getExpiresIn()){
    refreshUserToken()
  }
  fetch('https://api.spotify.com/v1/playlists/'+ playlistID +'/tracks', {
    method: "GET",
    headers: {
      'Authorization': "Bearer " + newUser.getAccessToken(),
    }  
  })
  .then( async (response) => await response.json())
  .then(async  (responseJson) => {
    //responseJson is taken in, and only the items section is taken. 
    //the items are the song info from the playlist. 
    var playlistItems = await responseJson.items;
    //The createHashTable function is called, and the playlist items are sent as a parameter. 
    await createHashTable("playlist", playlistItems);
  })
  .catch((error) => {console.error(error)})
}

//Function to call the api to retreive the current queue's songs, and then send to the createHashTable function is called. 
export async function getCurrentQueue(){
  if(Date.now()  > newUser.getExpiresIn()){
    refreshUserToken()
  }
  fetch('https://api.spotify.com/v1/me/player/queue', {
    method: "GET",
    headers: {
      'Authorization': "Bearer " + newUser.getAccessToken(),
    }  
  })
  .then((response) => response.json())
  .then((responseJson) => {
    //Need to take out after testing. 
    console.log("get queue response: " + responseJson.queue)
    createHashTable("queue", responseJson.queue);
  })
  .catch((error) => {console.error(error)})
}

//Function calls the getAudio-Features Spotify API.
//Using the response, creates the song objects, and calls the insertSong Hashtable function to insert the songs into the newSongHashTable.
export async function createHashTable(playlistType,  playlistItems){
  var getTempoString = await getSongIDList(playlistType, playlistItems)
  if(Date.now()  > newUser.getExpiresIn()){
    refreshUserToken()
  }
  fetch('https://api.spotify.com/v1/audio-features?ids=' + getTempoString,  {
     method: "GET",
      headers: {
        'Authorization': "Bearer " + newUser.getAccessToken(),
      }
    })
    .then((response) =>  response.json())
    .then((responseJson) => { 
      //The loop iterates through the playlist items, which are the songs. 
      for(var i = 0; i < playlistItems.length; i++){
        //If the playlistType is a queue, the playlistItems has a slightly different JSON structure.  
        //The playlistItems and the api response are matched up, and the song info needed is taken.
        //The song object is created, and inserted into the hash table. 
        if(playlistType == "queue"){
          const newSong = new Song(playlistItems[i].id, playlistItems[i].artists[0].name, playlistItems[i].name, playlistItems[i].album.images[2].url,responseJson.audio_features[i].tempo, responseJson.audio_features[i].energy);
          newSongHashTable.insertSong(newSong, newSong.tempo);
        }
        //If the playlistType is a playlist, the playlistItems has a slightly different JSON structure.  
        //The playlistItems and the api response are matched up, and the song info needed is taken.
        //The song object is created, and inserted into the hash table. 
        else if(playlistType == "playlist"){
          const newSong = new Song(playlistItems[i].track.id, playlistItems[i].track.artists[0].name, playlistItems[i].track.name, playlistItems[i].track.album.images[2].url,responseJson.audio_features[i].tempo,responseJson.audio_features[i].energy);
          newSongHashTable.insertSong(newSong, newSong.tempo);
        }  
      }
    })
    .catch((error) => {console.error(error); })
}

//Prints the interval lists to console.  Used for testing. 
export async function printTempofy(){
  intervalList.forEach(element => {
    console.log(element);
  })
}

//createTempofyPlaylist. Creates and writes the Playlist to the spotify player
export async function createTempofyPlaylist(playlistName){
    //Variables to hold the the song ID string to post to the Add Items to Playlist API and the playlistURI variable from the response. 
    let queueString = "";
    let playlistURI = "";
    //Iterates through the tempofyQueue  to get the songIDs to create the playlistSongString.
    for(var i = 0; i < tempofyQueue.songArray.length; i++){
      //If the song is not last,  adds a comma at the end of the string. 
      if(i < tempofyQueue.songArray.length - 1 ){
        queueString = queueString + "\"spotify:track:" + tempofyQueue.songArray[i].songID + "\",";
      }
      //If last song in the queue, doesn't add a comma at the end of the string. 
      else{
        queueString = queueString + "\"spotify:track:" + tempofyQueue.songArray[i].songID + "\"";
      }
    }
    //Creates a string which includes the queue string.
    //Used as the body of the api call to send songs into the newly created Spotify playlist. 
    var apiBodyString = '{ "uris": ['+ queueString + ']}'
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
     }
    //Fetch to call Create Playlist API.  
    //User can can create playlist name and description. 
    if(Date.now()  > newUser.getExpiresIn()){
      refreshUserToken()
    }
    fetch('https://api.spotify.com/v1/users/' + newUser.getUserID() + '/playlists', {
        method: "POST",
        headers: {
        'Authorization': "Bearer " + newUser.getAccessToken(),
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: playlistName,
            public: false
        })
    })
    //Response takes in the newly created playlistURI and saves it for later. 
    .then((response) => response.json())
    .then((responseJson) => {
        playlistURI = responseJson.uri
        const playlistID = responseJson.id
        //Fetch calls the Add Items to Playlist to add the songs sorted by Tempofy to the users newly created playlist. 
        if(Date.now()  > newUser.getExpiresIn()){
          refreshUserToken()
        }
        fetch("https://api.spotify.com/v1/playlists/" + playlistID + "/tracks", {
            method: "POST",
            headers: {
            'Authorization': "Bearer " + newUser.getAccessToken(),
            'Content-Type': 'application/json'
            },
            body: apiBodyString
        })
    })
    //Calls function to play the new playlist. 
    .then(() => {playTempofiedPlaylist(playlistURI)})
    .catch((error) => {console.error(error)})

}

//Need to update function to check accessToken function and check error out if player isn't select. 
//Function calls the Start/Resume Playback endpoint with the playlist uri to automatically play the playlist if a player is selected. 
 async function playTempofiedPlaylist(uri){
  if(Date.now()  > newUser.getExpiresIn()){
    refreshUserToken()
 }
          fetch("https://api.spotify.com/v1/me/player/play?device_id=" + newUser.getCurrentPlayer(), {
            method: "PUT",
        headers: {
          'Authorization': "Bearer " + newUser.getAccessToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "context_uri": uri
      })
        })
}