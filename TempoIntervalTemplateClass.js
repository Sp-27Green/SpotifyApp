//Class to create an object of a Interval Template. 
//The object has a name created by the user. 
//The array holds the separate intervals created by the user. 
export class TempoIntervalTemplate{
    constructor(templateName){
        this.templateName =  templateName
        this.intervalArray = [];
    }

    //Getters and setters. 
    setTemplateName(templateName){
        this.templateName = templateName;
    }

    getTemplateName(){
        return this.templateName;
    }

    setIntervalArray(intervalArray){
        this.intervalArray = intervalArray;
    }

    getIntervalArray(){
        return this.intervalArray;
    }
}