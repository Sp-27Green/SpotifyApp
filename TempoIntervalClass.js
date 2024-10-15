//Temp Interval Class holds the different intervals of the tempofied playlist.  
export class TempoInterval{
    //Constructor. Holds the information needed for the interval as well as an array of Song Objects for the interval.
    constructor(lowTempo, highTempo, intervalType, songAmount){
        this.lowTempo = lowTempo;
        this.highTempo = highTempo;
        this.intervalType = intervalType; 
        this.songAmount = songAmount;
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

    //Print interval function to test the TempoIntervalClass. 
    printInterval(){
        this.songArray.forEach(element => {
            element.forEach(songElement => {
                console.log(songElement.toString());
            })
        })
    }
}