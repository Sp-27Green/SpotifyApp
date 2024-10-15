//Extra functions is a page to hold functions or objects that are useful.  
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "./UserClass";
import { TempofyQueueClass } from './TempofyQueueClass';


//Creates and holds the user information.
export let newUser = new User(); // Ensure this is being exported
//Variables need for the Tempofy flow.
export let intervalList = [];
export let tempofyQueue  = new TempofyQueueClass();

//Trims the AsyncStorage function down to make it quicker to code. 
export async function storeData (key, value){
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
}