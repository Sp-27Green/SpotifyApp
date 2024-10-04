//Used for the User Spotify APIs

import { newUser } from './ExtraFunctions';

//Retrieves the Current Users Profile and returns the JSON
export async function getCurrentUsersProfile(){
  if(Date.now()  > newUser.getExpiresIn()){
    refreshUserToken()
  }  
  await fetch('https://api.spotify.com/v1/me', {
    method: "GET",
    headers:  {
      'Authorization': "Bearer " + newUser.getAccessToken(),
    }
  })
  .then((response) =>  response.json())
  .then((responseJson) => {
    userJSON = responseJson
  })
  .catch((error) => {
    console.error(error);
  })
  return userJSON
}

//Retrieves the User's Top Items and returns the JSON
//Allowed values: "artists", "tracks"
export async function getUsersTopItems(value){
  if(Date.now()  > newUser.getExpiresIn()){
      refreshUserToken()
  }
  
  await fetch('https://api.spotify.com/v1/me/top/' + value, {
      method: "GET",
      headers:  {
          'Authorization': "Bearer " + newUser.getAccessToken(),
      }
  })
  .then((response) =>  response.json())
  .then((responseJson) => {
    
    userJSON = responseJson
  })
  .catch((error) => {
    console.error(error);
  })
  return userJSON
}

//Retrieves another User's Profile from userID and returns the JSON
export async function getUsersProfile(userID){
  if(Date.now()  > newUser.getExpiresIn()){
      refreshUserToken()
  }
  await fetch('https://api.spotify.com/v1/users/' + userID, {
      method: "GET",
      headers:  {
          'Authorization': "Bearer " + newUser.getAccessToken(),
      }
  })
  .then((response) =>  response.json())
  .then((responseJson) => {
    userJSON = responseJson
  })
  .catch((error) => {
    console.error(error);
  })
  return userJSON
}

//Retrieves the  User's Followed Artists and returns the JSON
export async function getFollowedArtists(){
  if(Date.now()  > newUser.getExpiresIn()){
      refreshUserToken()
  }
  await fetch('https://api.spotify.com/v1/me/following?type=artist', {
      method: "GET",
      headers:  {
          'Authorization': "Bearer " + newUser.getAccessToken(),
      }
  })
  .then((response) =>  response.json())
  .then((responseJson) => {
    userJSON = responseJson
  })
  .catch((error) => {
    console.error(error);
  })
  return userJSON
}