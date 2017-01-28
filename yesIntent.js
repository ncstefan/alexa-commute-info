'use strict';
var commute_info = require('./commute_info');


function askNameAgain(){
    try{
        //user record not found                
        //build the list of all names
        var namelist = '';
        var idx = 0;
        if (app.dictionary.names.length == 1) {
            //single name/destination
            namelist = namelist + app.dictionary.names[0];
        }
        else {
            //multiple names/destinations
            app.dictionary.names.forEach(function(element) {
                if (idx == app.dictionary.names.length - 1) {
                    namelist += " and " + element;
                }
                else if (idx == 0) {
                    namelist += element;
                    idx++;
                }
                else {
                    namelist += ", " + element;
                    idx++;
                }
            }); 
        }
        //list registered names
        console.log("List of destination routes: " + namelist);
        //state change
        res.session("previousState", "nameNotFound");
        //prompt for name again
        var prompt = "It seems like your name is not registered in your portal. Please choose a name listed in your portal. You added destination routes for: " + namelist + ". For whom would you like to know the commute time? Say, my name is." ;
        return prompt;
    }
    catch(err){
        //error building list of names
        console.log("error building the name list");
        //state change
        res.session("previousState", "nameNotFound");
        //prompt for name again
        var prompt = "Sorry, I couldn't find your name. For whom would you like to know the commute time? Say, my name is." ;
        res.say(prompt).shouldEndSession(false);
    }

}

//yesIntent
exports.yesIntentHandler = function(req,res) {

    console.log("yesIntent()");

    if(!req.session("previousState")){
        console.log("YesIntent() - no state found");        
        res.session("previousState", "nameNotRecognized");
        var prompt = "Sorry, I did not recognize you. For whom would you like to know the commute duration?";
        res.say(prompt).shouldEndSession(false); 
        return true;
    }

    switch(req.sessionAttributes.previousState) {
        case "confirmName":
            var crtName = req.sessionAttributes["crtUser"];
            console.log("Processing yesIntent() for: " + crtName + ".");
            console.log("Registered names: " + app.dictionary);

            //ask again if name not found in the list
            if (app.dictionary.names.indexOf(crtName) == -1) {
                //state change
                res.session("previousState", "nameNotFound");
                //ask again prompt
                var prompt = askNameAgain();
                res.say(prompt).shouldEndSession(false);
            }
            else {
                //state change
                res.session("previousState", "correctName");
                //retrieve commute duration for <name>
                console.log("User found: getting live traffic info");
                commute_info.getLiveTraffic(crtName, function(err, duration) {
                    if(err){
                        res.say("I'm sorry "+ crtName + ". I have difficulties retrieving the commute time for your route. Please try again later.");
                        res.shouldEndSession(true).send();
                    }
                    res.say("Hello " + crtName + "! Your commute by car is: " + String(Math.round(duration/60)) + " minutes.");
                    res.shouldEndSession(true).send();
                });
                //return false immediately so alexa-app doesn't send the response
                //and waits for the async call above to return the response
                return false;
            }
            break;

        case "userFound":
            //state change
            res.session("previousState", "nameNotFound");
            //ask again prompt
            var prompt = askNameAgain();
            res.say(prompt).shouldEndSession(false);
            break;
    }

    return true;
};