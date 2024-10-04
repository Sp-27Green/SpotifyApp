import {newSongHashTable} from "./Tempo.js"

//Temp Interval Class holds the different intervals of the tempofied playlist.  
export class TempoInterval{
    //Constructor. Holds the information needed for the interval as well as an array of Song Objects for the interval.
    constructor(lowTempo, highTempo, intervalType, songAmount){
        this.lowTempo = lowTempo;
        this.highTempo = highTempo;
        this.intervalType = intervalType; 
        this.songAmount = songAmount;
        this.songArray = [];
        //retreiveSongs() called to retrieve songs from the Hash Table as per the data provided by the interval variables. 
        this.retrieveSongs();
    }

    //Getters and Setters for the class variables. 
    getLowTempo(){
        return this.lowTempo;
    }

    setLowTempo(lowTempo){
        this.lowTempo = lowTempo;
    }

    getHighTempo(){
        return this.highTempo;
    }

    setHighTempo(highTempo){
        this.highTempo = highTempo;
    }

    getIntervalType(){
        return this.intervalType;
    }

    setIntervalType(intervalType){
        this.intervalType = intervalType;
    }

    getSongAmount(){
        return this.songAmount;
    }

    setSongAmount(songAmount){
        this.songAmount = songAmount;
    }

    //Class function to retrieve Song objects from the Hash Table, and then adds them to the interval's array. 
    async retrieveSongs(){
        //If statement checks if the interval type is Increase. The song tempo will increase from the lowTempo to the highTempo. 
        if(this.intervalType == "increase"){
            //Index is used to find the right tempo range needed to send as a key to the getSong function in the Hash Table.  Initially set to zero. 
            var index = 0;
            //steps variable is calcualted to find the tempo range difference between the highTempo and low tempo. 
            const steps = Math.floor(this.highTempo / 5) - Math.floor(this.lowTempo / 5);
            //stepAmount variable is set with the calulation of how much to increase the index per song used.
            var stepAmount = steps / (this.songAmount - 1);
            //For loop to call find the tempo range needed, call the getSong function, the song object returned is added to the interval array, and the index is increased by the song amount. 
            for(var i = 0; i < this.songAmount; i++){
                var key =  await this.lowTempo + (Math.floor(index) * 5);
                var song = await newSongHashTable.getSong(key);
                await this.songArray.push(song);
                index = await index + stepAmount; 
            }
        }
        //Else if the interval type is decrease.  The song tempo will decrease from the highTempo to the lowTempo. 
        else if(this.intervalType == "decrease"){
            //Index is used to find the right tempo range needed to send as a key to the getSong function in the Hash Table.  Initially set to zero. 
            var index = 0;
            //steps variable is calcualted to find the tempo range difference between the highTempo and low tempo. 
            const steps = Math.floor(this.highTempo / 5) - Math.floor(this.lowTempo / 5);
            //stepAmount variable is set with the calulation of how much to decrease the index per song used.
            var stepAmount = steps / (this.songAmount - 1);
            //For loop to call find the tempo range needed, call the getSong function, the song object returned is added to the interval array, and the index is decreased by the song amount. 
            for(var i = 0; i < this.songAmount; i++){
                var key = this.highTempo - (Math.floor(index) * 5);
                var song = await newSongHashTable.getSong(key);
                await this.songArray.push(song);
                index = index + stepAmount;
            }
        }
        //Else if the interval type is "random". The songs will be random tempos in between the lowTempo and the highTempo.
        else if(this.intervalType == "random"){
            //steps variable is calcualted to find the tempo range difference between the highTempo and low tempo.
            const steps = Math.floor(this.highTempo / 5) - Math.floor(this.lowTempo / 5) + 1;
            //For loop to create a random tempo as the key.  Random number is created and then multiplied by the number of steps.  
            //Then multiplied by 5 and added to the low tempo to find the appropriate random tempo key.
            // The key is then used to retrieve a song and add it to the interval array. 
            for(var i = 0; i < this.songAmount; i++){
                var randomTempo = this.lowTempo  + (Math.floor(Math.random() * steps) * 5);
                var song = await newSongHashTable.getSong(randomTempo);
                await this.songArray.push(song);
            }
        }
    }

    //Print interval function to test the TempoIntervalClass. 
    printInterval(){
        this.songArray.forEach(element => {
            element.forEach(songElement => {
                console.log(songElement.toString());
            })
        })
    }
}