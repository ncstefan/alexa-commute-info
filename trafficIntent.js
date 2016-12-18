'use strict';
var commute_info = require('./commute_info');

// TrafficIntent
exports.trafficIntentHandler = function(req,res){

console.log("TrafficIntent() for: " + req.slot('Destinations') + " by " + req.slot('Options'));

        //get the name 
        var name = req.slot('Destinations');
    
        //get the car|bus option
        var opt = req.slot('Options');
        if( !opt ) opt = "car";

        // Ask again if name not found in the list
        if(app.dictionary.names.indexOf(name) == -1){
            res.say("Sorry, I didn't catch your name. Please repeat your name again.").shouldEndSession(false);
            return true;
        }

        // Save the current user
        res.session("crtUser", req.slot('Destinations'));

        // Get commute duration for <name>
        commute_info.getLiveTraffic(name, opt, function(duration){
            res.say("Hello " + name + "! Your commute by " + opt + " is " + String(Math.round(duration/60)) + " minutes.").shouldEndSession(true).send();
        });

        // Return false immediately so alexa-app doesn't send the response
        // and waits for the async call above to return the response
        return false;
};
