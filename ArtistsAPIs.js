//Used for the Artist Spotify APIs

import { newUser } from './ExtraFunctions';

//Retrieves the Artist using artistID and returns the JSON
export async function getArtist(artistID){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
    }
    await fetch('https://api.spotify.com/v1/artists/' + artistID, {
        method: "GET",
        headers:  {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
    .then((response) =>  response.json())
    .then((responseJson) => {
      artistJSON = responseJson
    })
    .catch((error) => {
      console.error(error);
    })
    return artistJSON
}

//Retrieves the Several Artists using artistsString and returns the JSON
//artist IDs in string must be separated by %2C to represent commas, or commas. 
export async function getSeveralArtists(artistsString){
  if(Date.now()  > newUser.getExpiresIn()){
      refreshUserToken()
  }
  await fetch('https://api.spotify.com/v1/artists?ids=' + artistsString, {
      method: "GET",
      headers:  {
          'Authorization': "Bearer " + newUser.getAccessToken(),
      }
  })
  .then((response) =>  response.json())
  .then((responseJson) => {
    artistsJSON = responseJson
  })
  .catch((error) => {
    console.error(error);
  })
  return artistsJSON
}

//Retrieves the Artist's albums using artistID and returns the JSON
export async function getArtistsAlbums(artistID){
  if(Date.now()  > newUser.getExpiresIn()){
      refreshUserToken()
  }
  await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums', {
      method: "GET",
      headers:  {
          'Authorization': "Bearer " + newUser.getAccessToken(),
      }
  })
  .then((response) =>  response.json())
  .then((responseJson) => {
    artistsAlbumsJSON = responseJson
  })
  .catch((error) => {
    console.error(error);
  })
  return artistsAlbumsJSON
}

//Retrieves the Artist's top tracks using artistID and returns the JSON
export async function getArtistsTopTracks(artistID){
  if(Date.now()  > newUser.getExpiresIn()){
      refreshUserToken()
  }
  await fetch('https://api.spotify.com/v1/artists/' + artistID + '/top-tracks', {
      method: "GET",
      headers:  {
          'Authorization': "Bearer " + newUser.getAccessToken(),
      }
  })
  .then((response) =>  response.json())
  .then((responseJson) => {
    artistsTopTracksJSON = responseJson
  })
  .catch((error) => {
    console.error(error);
  })
  return artistsTopTracksJSON
}

//Retrieves the Artist's related artists using artistID and returns the JSON
export async function getArtistsRelatedArtists(artistID){
  if(Date.now()  > newUser.getExpiresIn()){
      refreshUserToken()
  }
  await fetch('https://api.spotify.com/v1/artists/' + artistID + '/related-artists', {
      method: "GET",
      headers:  {
          'Authorization': "Bearer " + newUser.getAccessToken(),
      }
  })
  .then((response) =>  response.json())
  .then((responseJson) => {
    artistsRelatedJSON = responseJson
  })
  .catch((error) => {
    console.error(error);
  })
  return artistsRelatedJSON
}

//jace made this, i did this to handle artists discography, couldnt get the other functions to work for me
export async function getArtistsDiscography(artistId) {
  if (Date.now() > newUser.getExpiresIn()) {
    await refreshUserToken();
  }

  const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,compilation,appears_on`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${newUser.getAccessToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch artist discography');
  }

  return response.json();
}