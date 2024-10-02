//Ready for Github and testing. 
//Needs notes. 

export class Song {
    constructor(songID, artist, songTitle, albumImage, tempo, energy) {
        this.songID = songID
        this.artist = artist;
        this.songTitle = songTitle;
        this.albumImage = albumImage;
        this.tempo = tempo;
        this.energy = energy;
        
    }
//Get Methods
    getSongID(){
        return this.songID;
    }

    getArtist(){
        return this.artist;
    }

    getSongTitle(){
        return this.songTitle;
    }

    getAlbumImage(){
        return this.albumImage;
    }

    getTempo(){
        return this.tempo;
    }

    getEnergy(){
        return this.energy;
    }

//To String 
    toString(){
        return "ID: " + this.songID + ", Artist: " + this.artist + ", Title: " + this.songTitle + ", ImageURI: " + this.albumImage + ", Tempo: " + this.tempo;
    }
}

