//Used to hold the current user's info. Looking for a possible better way of doing this since its unencrypted. 
import {TempoInterval} from './TempoIntervalClass'
import {TempoIntervalTemplate} from './TempoIntervalTemplateClass'

export class User{
    constructor(){
        this.userName = "";
        this.userID = "";
        this.accessToken = "";
        this.refreshToken = "";
        this.expiresIn = 0;
        this.currentPlayer = "";
        this.usersIntervalTemplates = [];
        this.tempoInterval  = []
        this.setTestTemplate()
    
    }

    //Getters and Setters
    getUserName(){
        return this.userName;
    }

    getUserID(){
        return this.userID;
    }


    getAccessToken(){
        return this.accessToken;
    }

    getRefreshToken(){
        return this.refreshToken;
    }

    getExpiresIn(){
        return this.expiresIn;
    }

    getCurrentPlayer(){
        return this.currentPlayer;
    }

    setUserName(userName){
        this.userName = userName;
    }
    setUserID(userID){
        this.userID = userID;
    }

    setAccessToken(accessToken){
        this.accessToken = accessToken;
    }

    setRefreshToken(refreshToken){
        this.refreshToken = refreshToken;
    }

    setExpiresIn(expiresIn){
        this.expiresIn = expiresIn;
    }

    setCurrentPlayer(currentPlayer){
        this.currentPlayer = currentPlayer;
    }

    setTestTemplate(){
        if(this.usersIntervalTemplates.length == 0){  
            var intervalOne = new TempoInterval()
            intervalOne.setIntervalType("increase");
            intervalOne.setSongAmount(3)
            intervalOne.setLowTempo(110)
            intervalOne.setHighTempo(140)
            var intervalTwo = new TempoInterval()
            intervalTwo.setIntervalType("random");
            intervalTwo.setSongAmount(10)
            intervalTwo.setLowTempo(140)
            intervalTwo.setHighTempo(140)
            var intervalThree = new TempoInterval()
            intervalThree.setIntervalType("decrease")
            intervalThree.setSongAmount(7)
            intervalThree.setLowTempo(125)
            intervalThree.setHighTempo(140)
            var template = new TempoIntervalTemplate("Test template")
            template.intervalArray.push(intervalOne)
            template.intervalArray.push(intervalTwo)
            template.intervalArray.push(intervalThree)
            this.usersIntervalTemplates.push(template) 
        }                          
        
    }
}