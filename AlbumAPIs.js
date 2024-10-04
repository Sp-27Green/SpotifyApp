//Spotify Album APIS

import { newUser } from './ExtraFunctions';

//Retrieves Album from album ID and returns the JSON
export async function getAlbum(albumID){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
    }
    await fetch('https://api.spotify.com/v1/albums/' + albumID, {
        method: "GET",
        headers:  {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
    .then((response) =>  response.json())
    .then((responseJson) => {
      albumJSON = responseJson
    })
    .catch((error) => {
      console.error(error);
    })
    return albumJSON
}

//Retrieves Albums from multiple album IDs and returns the JSON
//album IDs in string must be separated by %2C to represent commas, or by commas 
export async function getSeveralAlbums(albumsString){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
    }
    await fetch('https://api.spotify.com/v1/albums?ids=' + albumsString, {
        method: "GET",
        headers:  {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
    .then((response) =>  response.json())
    .then((responseJson) => {
      albumsJSON = responseJson
    })
    .catch((error) => {
      console.error(error);
    })
    return albumsJSON
}

//Retrieves Albumtracks using the album ID and returns the JSON
export async function getAlbumTracks(albumID){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
    }
    await fetch('https://api.spotify.com/v1/albums/' + albumID + '/tracks', {
        method: "GET",
        headers:  {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
    .then((response) =>  response.json())
    .then((responseJson) => {
      albumTracksJSON = responseJson
    })
    .catch((error) => {
      console.error(error);
    })
    return albumTracksJSON
}

//Retrieves User's saved albums returns the JSON
export async function getUsersSavedAlbums(){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
    }
    await fetch('https://api.spotify.com/v1/me/albums', {
        method: "GET",
        headers:  {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
    .then((response) =>  response.json())
    .then((responseJson) => {
      usersAlbumsJSON = responseJson
    })
    .catch((error) => {
      console.error(error);
    })
    return usersAlbumsJSON
}

//Retrieves New Releases and returns the JSON
export async function getNewReleases(){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
    }
    await fetch('https://api.spotify.com/v1/browse/new-releases', {
        method: "GET",
        headers:  {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
    .then((response) =>  response.json())
    .then((responseJson) => {
      newReleasesJSON = responseJson
    })
    .catch((error) => {
      console.error(error);
    })
    return newReleasesJSON
}



