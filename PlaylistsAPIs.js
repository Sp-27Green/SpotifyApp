//Used for the Playlists Spotify APIs

import { newUser } from './ExtraFunctions';

//Retrieves the playlist based on playlist ID, and returns the JSON. 
export async function getPlaylist(playlistID){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
    }
    await fetch('https://api.spotify.com/v1/playlists/' + playlistID, {
        method: "GET",
        headers:  {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
    .then((response) =>  response.json())
    .then((responseJson) => {
      playlistJSON = responseJson
    })
    .catch((error) => {
      console.error(error);
    })
    return playlistJSON
}

//Retrieves the playlist items based on playlist ID, and returns the JSON. 
export async function getPlaylistItems(playlistID){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
    }
    await fetch('https://api.spotify.com/v1/playlists/' + playlistID + '/tracks', {
        method: "GET",
        headers:  {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
    .then((response) =>  response.json())
    .then((responseJson) => {
      playlistItemsJSON = responseJson
    })
    .catch((error) => {
      console.error(error);
    })
    return playlistItemsJSON
}

//Retrieves the current user's playlists , and returns the JSON. 
export async function getCurrentUsersPlaylists(){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
    }
    await fetch('https://api.spotify.com/v1/me/playlists', {
        method: "GET",
        headers:  {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
    .then((response) =>  response.json())
    .then((responseJson) => {
      usersPlaylistsJSON = responseJson
    })
    .catch((error) => {
      console.error(error);
    })
    return usersPlaylistsJSON
}

//for retrieving another user's playlists based on the username or userID. Returns the JSON.
export async function getUsersPlaylists(user){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
    }
    await fetch('https://api.spotify.com/v1/users/'+ user +'/playlists', {
        method: "GET",
        headers:  {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
    .then((response) =>  response.json())
    .then((responseJson) => {
      usersPlaylistsJSON = responseJson
    })
    .catch((error) => {
      console.error(error);
    })
    return usersPlaylistsJSON
}

//for retrieving featured playlists. Returns the JSON
export async function getFeaturedPlaylists(){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
    }
    await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
        method: "GET",
        headers:  {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
    .then((response) =>  response.json())
    .then((responseJson) => {
      featuredPlaylistsJSON = responseJson
    })
    .catch((error) => {
      console.error(error);
    })
    return featuredPlaylistsJSON
}

//for retrieving catoegory playlists based on category like "Country", "Hip-Hop", "punk". returns the JSON.
export async function getCategorysPlaylists(category){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
    }
    await fetch('https://api.spotify.com/v1/browse/categories/' + category + '/playlists', {
        method: "GET",
        headers:  {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
    .then((response) =>  response.json())
    .then((responseJson) => {
      categoryPlaylistsJSON = responseJson
    })
    .catch((error) => {
      console.error(error);
    })
    return categoryPlaylistsJSON
}

//Retrieves playlist cover image based on the playlist ID , and returns the JSON.
export async function getPlaylistCoverImage(playlistID){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
    }
    await fetch('https://api.spotify.com/v1/playlists/' + playlistID + '/images', {
        method: "GET",
        headers:  {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
    .then((response) =>  response.json())
    .then((responseJson) => { 
      playlistImageJSON = responseJson
    })
    .catch((error) => {
      console.error(error);
    })
    return playlistImageJSON
}







