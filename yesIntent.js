'use strict';
var commute_info = require('./commute_info');
var loadUserInfo = require('./loadUserInfo');


function getNameList(){
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
            for(var i=0, len = app.dictionary.names.length; i < len; i++){
                if (i == len - 1) 
                    namelist += " and " + app.dictionary.names[i];
                else if (i == 0) 
                    namelist += app.dictionary.names[i];
                else 
                    namelist += ", " + app.dictionary.names[i];
            }
        }
        //list registered names
        console.log("List of destination routes: " + namelist);
        //prompt for name again
        return namelist;
    }
    catch(err){
        //error building list of names
        console.log("error building the name list");
        return namelist;
    }

}

//yesIntent
exports.yesIntentHandler = function(req,res) {

    console.log("yesIntent()");

    if(!req.session("previousState")){
        console.log("YesIntent() - no state found");        
        //load user session (async function)
        loadUserInfo.loadUserSession(req.userId, res, function(err, data){
            if(err){}
            else{}
        }); //end - loadUserSession()        
        //async call -> should return false
        return false;
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
                var nameList = getNameList();
                if(!nameList){
                    //err reading name list - END session`
                    var prompt = "Sorry, I have difficulties retrieving the list of registered routes. Please try again later.";
                    res.say(prompt).shouldEndSession(true);
                }
                else{
                    //ask for a name in the list
                    var prompt = "I'm sorry I couldn't find a route for your name. Please choose a name you registered a destination route for. You added routes for: " + nameList + ". For whom would you like to know the commute time? Say, my name is:" ;
                    res.say(prompt).shouldEndSession(false);
                }
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
                    res.say(crtName + ", your commute by car is: " + String(Math.round(duration/60)) + " minutes.");
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
            var nameList = getNameList();
            if(!nameList){
                //no names registered -> send to registration portal and END session.
                var prompt = "Sorry, I couldn't find any registered destination routes. First, you will need to register your commute destinations on the registration portal. Simply follow the instructions on the card I sent to your Alexa application.";
                res.say(prompt).shouldEndSession(true);
            }
            else{
                //list registered routes and ask for name
                var prompt = "Please choose a name you registered a destination route for. You added routes for: " + nameList + ". For whom would you like to know the commute time? Say, my name is." ;
                res.say(prompt).shouldEndSession(false);
            }
            break;
    }

    return true;
};