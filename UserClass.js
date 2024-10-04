//Used to hold the current user's info. Looking for a possible better way of doing this since its unencrypted. 

export class user{
    constructor(){
        var userName = "";
        var accessToken = "";
        var refreshToken = "";
        var expiresIn = 0;
        var currentPlayer = "";
    }

    //Getters and Setters
    getUserName(){
        return this.userName;
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