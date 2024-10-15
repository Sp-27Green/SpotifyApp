import { newUser } from "./ExtraFunctions";
import  {Song}  from "./SongClass";


//Hash Table class. Each element holds an array of Songs for a specific tempo range. 
export class SongHashTable{
    constructor() {
        this.hashTable = [];
        //Secondary hash table that holds the index of the last song in that hashTable index that is going to be used for the Tempofy Playlist Queue. 
        this.songIndexCount = [];
        //Array holds 5 songs at a time.  The data from the songs will be used to run the getRecommened API to retrieve more songs. 
        this.songRecommenedList = [];
        this.songReferenceAmount = 0;
        //For loop to create an array in each element and sets the sondIndexCount for each index to 0; 
        
        for(var i = 0; i < 100; i++ ){
            this.hashTable.push([]);
            this.songIndexCount[i] = 0 ;
        }
    }

    //Hash key.  Takes in the tempo of the song and divides by 5.  The floor is the index of the hash table the song goes to.  The Tempo ranges are xx0-xx4, and xx5-xx9.
    _setKey(key){
        return Math.floor(key / 5);
    }

    //Method to insert Song into Hash Table. 
    insertSong(song, key){
        //Check to see if the songRecommendedList is less than 5, since the getRecommended API will only take in 5 song IDs. Push Song object to the array.
        if(this.songReferenceAmount < 5){
            this.songRecommenedList.push(song);
            this.songReferenceAmount++;
        }
        //If the songRecommendedList is 5 or greater, pushes Song object to the back of the array and shifts(pops) the front of the array. 
        else{
            this.songRecommenedList.splice(3,0,song);
            this.songRecommenedList.pop();
        }
        //Checks key and pushes the Song object to the correct index of the Hash Table. 
        const index = this._setKey(key);
        this.hashTable[index].push(song);
    }


    //Need to update the accessToken fetch to check experation. 
    //Get Song method takes in tempo as the key.  Then retrieves Song object within that index to match the tempo range. 
    async getSong(key){
        const index = this._setKey(key);
        //If the array tables length is larger then the current count for the array in the songIndexCount, 
        //Copy song and return song,  and also up the count in songIndexCount +1 for that index. 
        if(this.hashTable[index].length > this.songIndexCount[index]){
            var song = this.hashTable[index][this.songIndexCount[index]];
            this.songIndexCount[index] = this.songIndexCount[index] + 1;
            return song;
        }
        //Else if the Array is empty at the index, the songRecommendList is used to run the getRecommend API to retrieve more songs. 
        else{
            //Min and Max Tempos are calcuated for the uri string. 
            const minTempo = index * 5;
            const maxTempo = minTempo + 4;
            //Energy Values and the songID strings are pulled from the songRecommendedList.
            var energyValue = 0;
            var recommendedSongIDString= "";
            this.songRecommenedList.forEach(element => {
                recommendedSongIDString = recommendedSongIDString + element.songID+ ",";
                energyValue = energyValue + element.energy;   
            })
            //Average energy Value is calculated.  0.1 is added and subtracted to create a range of energy for the URI. 
            energyValue = energyValue / 5;
            const minEnergyValue = energyValue - 0.1;
            const maxEnergyValue = energyValue + 0.1;
            //Sets the amount of recommended Songs retrieved with the getRecommended API.
            const recommendedSongAmount = 30;
            //API call to the getRecommended endpoint.   
            if(Date.now()  > newUser.getExpiresIn()){
                refreshUserToken()
            }
            await fetch('https://api.spotify.com/v1/recommendations?limit='+ recommendedSongAmount +'&seed_tracks=' + recommendedSongIDString + '&min_tempo=' + minTempo + '&max_tempo=' + maxTempo + '&min_energy=' + minEnergyValue + '&max_energy=' + maxEnergyValue,{
                method: "GET",
                headers:  {
                    'Authorization': "Bearer " + newUser.getAccessToken(),
                }
            } )
            //JSON response is sent to a forloop to create a string of the song IDs for the getAudio-Features api. 
            .then((response) =>  response.json())
            .then(async (responseJson) => {
                var songIDString = "";
                var newSongs = responseJson.tracks;
                newSongs.forEach( element => {
                    songIDString = songIDString + element.id + ",";
                })
                //API call to the getAudio-Features endpoingt.  
                if(Date.now()  > newUser.getExpiresIn()){
                    refreshUserToken()
                }
                await fetch('https://api.spotify.com/v1/audio-features?ids=' + songIDString,  {
                    method: "GET",
                    headers: {
                      'Authorization': "Bearer " + newUser.getAccessToken(),
                    }
                    })
                    //Response is senth through a for loop to create the Song Objects and insert them into the array at index in the hash table. 
                    .then((response) =>  response.json())
                    .then((responseJson) => { 
                        for(var i = 0; i < responseJson.audio_features.length; i++){
                        const newSong = new Song(newSongs[i].id, newSongs[i].artists[0].name, newSongs[i].name, newSongs[i].album.images[2].url,responseJson.audio_features[i].tempo,responseJson.audio_features[i].energy);
                        this.insertSong(newSong,responseJson.audio_features[i].tempo);
                        }
                    })           
            })
            //Song object from the index is returned. 
            //The songIndexCount for that index is incremented. 
            var song = await this.hashTable[index][this.songIndexCount[index]];
            this.songIndexCount[index] = this.songIndexCount[index] + 1;
            return song; 
        }
    }

    //Resets arrays in each index. 
    clearTable(){
        this.hashTable.forEach(element => {
            element = [];
        })
    }

    //Written for testing the Hash Table.  Prints entire hash table to console. 
    printHashTable(){
        var index = 0;
        this.hashTable.forEach(element => {
            console.log(index * 5);
            console.log(JSON.stringify(element));
            index++;
        })
    }

    //Reseets the songIndexCount in all indices to zero.  So a new playlist or queue can be inserted. 
    resetCount(){
        for(var i = 0; i < 100; i++ ){
            this.songIndexCount[i] = 0 ;
        }
        
    }
}