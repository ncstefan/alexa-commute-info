'use strict';
var commute_info = require('./commute_info');

// nameIntent
exports.nameIntentHandler = function(req,res) {

    console.log("nameIntent()");

    if(!req.session("previousState")){
        console.log("NameIntent() - no state found");
        res.shouldEndSession(false);
        return true;
    }
    
    switch(req.sessionAttributes.previousState) {

        // intent did not trigger at start-up -> triggered at launchRequest
        case "loadingUserInfo":
            res.session("previousState", "validatingName");
            console.log("nameIntent() for: " + req.slot('Name') + " by " + req.slot('Options'));
            
            //get the name 
            var name = req.slot('Name');
            console.log("Intent for name: " + name);
            
            //get the car|bus option
            var opt = req.slot('Options');
            if (!opt) opt = "car";

            //ask again if name not found in the list
            if (app.dictionary.names.indexOf(name) == -1){
                res.say("Sorry, I didn't catch your name. Please repeat your name again. Say my name is.").shouldEndSession(false);
                return true;
            }

            //save the current user
            res.session("crtUser", req.slot('Name'));

            //get commute duration for <name>
            commute_info.getLiveTraffic(name, opt, function(duration) {
                res.say("Hello " + name + "! Your commute by " + opt + " is " + String(Math.round(duration/60)) + " minutes.").shouldEndSession(true);
                res.send();
            });

            //return false immediately so alexa-app doesn't send the response
            //and waits for the async call above to return the response
            break;
    }
    
    return false;
};
