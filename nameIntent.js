'use strict';
var commute_info = require('./commute_info');

// NameIntent
exports.nameIntentHandler = function(req,res) {

console.log("NameIntent()");

    if(!req.session("previousState")) {
        res.shouldEndSession(false);
        return true;
    }
    
    switch(req.sessionAttributes.previousState) {

        // Traffic intent did not trigger at start-up
        case "nameNotRecognized": 
            var name = req.slot('Name');
            res.session("previousState", "nameInput");
            res.session("crtUser", name);
            var prompt = "Nice to meet you " + name + ". Did I pronounce your name properly?";
            res.say(prompt).shouldEndSession(false);
            res.send();
            break;

        // Traffic intent did not trigger at start-up -> triggered at launch
        case "acquaintance":
            res.session("previousState", "nameRecognized");
            console.log("nameIntent() (gets traffic) for: " + req.slot('Name') + " by " + req.slot('Options'));
            //get the name 
            var name = req.slot('Name');
            console.log("Intent for name: " + name);
            //get the car|bus option
            var opt = req.slot('Options');
            if ( !opt ) opt = "car";

            // Ask again if name not found in the list
            if (app.dictionary.names.indexOf(name) == -1){
                res.say("Sorry, I didn't catch your name. Please repeat your name again. Say my name is.").shouldEndSession(false);
                return true;
            }

            // Save the current user
            res.session("crtUser", req.slot('Name'));

            // Get commute duration for <name>
            commute_info.getLiveTraffic(name, opt, function(duration) {
                res.say("Hello " + name + "! Your commute by " + opt + " is " + String(Math.round(duration/60)) + " minutes.").shouldEndSession(true);
                res.send();
            });

            // Return false immediately so alexa-app doesn't send the response
            // and waits for the async call above to return the response
            break;

    }
    return false;
};
