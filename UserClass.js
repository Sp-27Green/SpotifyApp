//Used to hold the current user's info. Looking for a possible better way of doing this since its unencrypted. 

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
}