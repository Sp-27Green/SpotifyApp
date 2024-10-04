//Extra functions is a page to hold functions or objects that are useful.  

import AsyncStorage from '@react-native-async-storage/async-storage';
import { user } from "./UserClass";

//Creates and holds the user information.
export let newUser = new user();

//Trims the AsyncStorage function down to make it quicker to code. 
export async function storeData (key, value){
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
}