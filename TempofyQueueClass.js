//Class object holds the songs for the creating the Tempofied list of songs before creating the playists in Spotify. 
export class TempofyQueueClass{
    constructor(){
        //Holds the list of songs for the queue. 
        this.songArray = [];
    }

    //Getter to get the songArray.
    getSongArray(){
        return this.songArray
    }

    //Function to retrieve songs from teh Hash Table as per the user's chosen Interval Template. 
    async retrieveSongs(hashTable, intervalArray){
        //For await loop to loop through the intervalArray, and retrieve songs from the hashtable. 
        //For await is used so next iteration waits to start until the previous iteration finishes
        for await(let element of intervalArray){
            //If the current Interval is for increase. 
            if(element.intervalType == "increase"){
                //When increasing through the tempo intervals, we need to know how many songs are needed per interval. 
                //To do this we divided the high tempo and low tempo by five, and then find the floor of both. 
                //Then we subtract the low result from the high result.
                //This will give us the amount of steps(indices in the hash table), we need to cover. 
                // The number of steps is then divided by the amount of songs for the interval -1. 
                // This gives us our indexSplit. 
                //We set stepIndex to 0;
                //To find the correct tempo needed, we reduce the stepIndex and then multiply it by 5 before adding the interval's low tempo. 
                //This gives us the appropriate key to send to the getStong function to retrieve a song with correct tempo.
                //At the end of the loop, the indexSplit is added to the stepIndex so the next iteration will have the appropriate tempo.
                var stepIndex = 0;
                //Find the number of steps.
                const steps = Math.floor(element.highTempo / 5) - Math.floor(element.lowTempo / 5);
                //Find the index split.
                var indexSplit = steps / (element.songAmount - 1);
                //For loop to retrieve the amount of songs for the interval, and add the songs to the queue. 
                for(var i = 0; i < element.songAmount; i++){
                    //Get approiate key(tempo) using the stepIndex, retrieve song, and increase the stepIndex.
                    var key =  await parseInt(element.lowTempo) + (Math.floor(stepIndex) * 5);
                    var song = await hashTable.getSong(key);
                    await this.songArray.push(song);
                    stepIndex = await stepIndex + indexSplit;
                }
            }

            //Else if the interval is "decrease"
            else if(element.intervalType == "decrease"){
                //We need to find the indexSplit and steps just like with the Increase. 
                //We set stepIndex to 0;
                var stepIndex = 0;
                //Find the number of steps.
                //Find the index split.
                const steps = Math.floor(element.highTempo / 5) - Math.floor(element.lowTempo / 5);
                var intervalSplit = steps / (element.songAmount - 1);
                //For loop to retrieve the amount of songs for the interval, and add the songs to the queue. 
                for(var i = 0; i < element.songAmount; i++){
                    //Get approiate key(tempo) using the stepIndex, retrieve song, and increase the stepIndex.
                    //But this time the stepIndex is subtracted from the high tempo. 
                    var key = element.highTempo - (Math.floor(stepIndex) * 5);
                    var song = await hashTable.getSong(key);
                    await this.songArray.push(song);
                    index = stepIndex + intervalSplit;
                }
            }

            //If interval was random. 
            else if(element.intervalType == "random"){
                //Find the number of steps. 
                const steps = Math.floor(element.highTempo / 5) - Math.floor(element.lowTempo / 5) + 1
                //For loop to retrieve the amount of songs for the interval, and add the songs to the queue. 
                for(var i = 0; i < element.songAmount; i++){
                    //Random number is generated to stay withen the number of tempo steps. 
                    //Random number is then added to the low tempo and used as a key to get song from hash table.
                    var randomTempo = parseInt(element.lowTempo)  + (Math.floor(Math.random() * steps) * 5)
                    var song = await hashTable.getSong(randomTempo)
                    await this.songArray.push(song)
                }
            }
        }  
    }
}