import { newUser } from './ExtraFunctions';

//Search retrieves the json for what is search. I only set it to search artists, tracks, albums, and playlists. 
//To pull the info from the returned json, the format is as follows:
//returnedJSON.artists
//returnedJSON.tracks
//returnedJSON.albums
//returnedJSON.playlists
export async function search(searchString){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
    }
    await fetch('https://api.spotify.com/v1/search?q=' + searchString + '&type=track,album,artist,playlist', {
        method: "GET",
        headers:  {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
    .then(async (response) =>  await response.json())
    .then((responseJson) => { 
      searchResponse = responseJson
    })
    .catch((error) => {
      console.error(error);
    })
    return searchResponse
  }