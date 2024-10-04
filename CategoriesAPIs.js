//Used for the Categories Spotify APIs

import {  newUser } from './ExtraFunctions.js';

//Retrieves the several categories and returns the JSON. Categories like "Hip-Hop" or "Country"
export async function getSeveralBrowseCategories(){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
    }
    await fetch('https://api.spotify.com/v1/browse/categories', {
        method: "GET",
        headers:  {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
    .then((response) =>  response.json())
    .then((responseJson) => {
      categoriesJSON = responseJson
    })
    .catch((error) => {
      console.error(error);
    })
    return categoriesJSON
}

//Retrieves single category by categoryID and returns the JSON.  CategoryID can be something like "Hip-Hop" or "Country".
export async function getSingleBrowseCategories(categoryID){
    if(Date.now()  > newUser.getExpiresIn()){
        refreshUserToken()
    }
    await fetch('https://api.spotify.com/v1/browse/categories/' + categoryID, {
        method: "GET",
        headers:  {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
    .then((response) =>  response.json())
    .then((responseJson) => {
      categoriesJSON = responseJson
    })
    .catch((error) => {
      console.error(error);
    })
    return categoriesJSON
}