//Need to update accessToken for experiration retrieval 

import AsyncStorage from '@react-native-async-storage/async-storage';
import {storeData } from "./ExtraFunctions";
import { Song } from './Classes';
import { TempoInterval } from './TempoIntervalClass';
import { SongHashTable } from './SongHashTable';

//Variables need for the Tempofy flow.
export const newSongHashTable = new SongHashTable();
let intervalList = [];

//getSongIDList function is used to create the songID string needed for the getAudio-Features api. 
//Paramater is used to determine if the originating list is pulled from a queue or playlist. 
//The song list is pulled from the AsyncStorage.
//For loop is run to create the string, and then string is returned. 
export async function getSongIDList(songListType){
  const currentQueue = JSON.parse(await AsyncStorage.getItem(songListType));
  var songIDString = "";
  currentQueue.forEach( async element => {
    if(songListType == "queue"){
      songIDString = songIDString + element.id + ",";
    }
    else if(songListType == "playlist"){
      songIDString = songIDString + element.track.id + ",";
    }
  })
  return songIDString
}

//fillHashTable function fills the hash table with the given queue or playlist. 
export async function fillHashTable(songListType) {
    //currentQueue is the variable to hold the queue/playlist and is pulled from AsyncStorage.  The accessToken is pulled as well. 
    const currentQueue = JSON.parse(await AsyncStorage.getItem(songListType));
    const accessToken = await AsyncStorage.getItem("accessToken");
    //songIDList is created to be used in the getAudio-features API.
    var songIDList = await getSongIDList(songListType);
    //Get Audio-Features API call.
    fetch('https://api.spotify.com/v1/audio-features?ids=' + songIDList,  {
       method: "GET",
        headers: {
          'Authorization': "Bearer " + accessToken,
        }
      })
      //currenntQueue is iterated through using a for loop.  The Song objects are created based off if they are from a queue or playlist.
      //The song objects are then pushed directly to the hash table. 
      .then((response) =>  response.json())
      .then((responseJson) => { 
        for(var i = 0; i < currentQueue.length; i++){
          if(songListType == "queue"){
            const newSong = new Song(currentQueue[i].id, currentQueue[i].artists[0].name, currentQueue[i].name, currentQueue[i].album.images[2].url,responseJson.audio_features[i].tempo, responseJson.audio_features[i].energy);
            newSongHashTable.insertSong(newSong, newSong.tempo);
          }
          else if(songListType == "playlist"){
            const newSong = new Song(currentQueue[i].track.id, currentQueue[i].track.artists[0].name, currentQueue[i].track.name, currentQueue[i].track.album.images[2].url,responseJson.audio_features[i].tempo,responseJson.audio_features[i].energy);
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
export async function createTempofyPlaylist(playlistName, playlistDescription){
    //Variables to hold the the song ID string to post to the Add Items to Playlist API and the playlistURI variable from the response. 
    let playlistSongString = "";
    let playlistURI = "";
    //Iterates through the intervalList Array to get the songIDs to create the playlistSongString.
    intervalList.forEach(element => {
        element.songArray.forEach(songElement => {
        playlistSongString = playlistSongString + "spotify%3Atrack%3A" + songElement["songID"] + ",";
      
        })
    })
    //Retrieve the accessToken and the userID from Async Storage.  
    //May create user class later to store the userID for quicker access with asyncstorage.
    const accessToken = await AsyncStorage.getItem("accessToken")
    let userID = await AsyncStorage.getItem("userID")
    var querystring = require('querystring');
    //Fetch to call Create Playlist API.  
    //User can can create playlist name and description. 
    fetch('https://api.spotify.com/v1/users/' + userID + '/playlists', {
        method: "POST",
        headers: {
        'Authorization': "Bearer " + accessToken,
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: playlistName,
            description: playlistDescription,
            public: false
        })
    })
    //Response takes in the newly created playlistURI and saves it for later. 
    .then((response) => response.json())
    .then((responseJson) => {
        playlistURI = responseJson.uri
        const playlistID = responseJson.id
        //Fetch calls the Add Items to Playlist to add the songs sorted by Tempofy to the users newly created playlist. 
        fetch("https://api.spotify.com/v1/playlists/" + playlistID + "/tracks?uris=" + playlistSongString, {
            method: "POST",
            headers: {
            'Authorization': "Bearer " + accessToken,
            'Content-Type': 'application/json'
            }
        })
    })
    //Calls function to play the new playlist. 
    .then(() => {playTempofiedPlaylist(playlistURI)})
    .catch((error) => {console.error(error)})

}

//Need to update function to check accessToken function and check error out if player isn't select. 
//Function calls the Start/Resume Playback endpoint with the playlist uri to automatically play the playlist if a player is selected. 
async function playTempofiedPlaylist(uri){
  const playerID = await AsyncStorage.getItem("player");
  const accessToken = await AsyncStorage.getItem("accessToken")
          fetch("https://api.spotify.com/v1/me/player/play?device_id=" + playerID, {
            method: "PUT",
        headers: {
          'Authorization': "Bearer " + accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "context_uri": uri
      })
        })
}