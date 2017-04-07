'use strict';
var commute_info = require('./commute_info');
var loadUserInfo = require('./loadUserInfo');


// nameIntent
exports.nameIntentHandler = function(req,res) {

    if( typeof req.sessionAttributes === "undefined" || typeof req.sessionAttributes.previousState === "undefined" ){
        //nameIntent called directly
        console.log("NameIntent() - no state found");
        //call the loadUserInfo function 
        loadUserInfo.loadUserInfo(req.userId, function(err, data) {
            if(err) {
                //user record not found
                res.session("previousState", "userNotFound");
                var prompt = "We haven't met before. Welcome to the Daily Commute. First, you will need to register your Alexa location and the commute destinations on the registration portal. Simply follow the instructions on the card I just sent to your Alexa application.";
                res.say(prompt).shouldEndSession(true).send();

                //send card
                res.card({
                    type: "Standard",
                    title: "Welcome to Commute Info Service!", // this is not required for type Simple
                    text: "Your userID is :\n" + req.userId + "\nTo register, visit the registration portal here:\n" + "http://alexacommuteinforeg.us-east-1.elasticbeanstalk.com" + "\nFollow these steps:\n1. Copy and paste your userID into the portal to have access to our services\n2. Provide the names of everyone in your household along with their home address and their destination address\n3. Now you can start using our services"
                });
            }
            else{
                //user record found
                res.session("previousState", "userFound");
                console.log("Found userID in DB: "+ JSON.stringify(data));
                var prompt = loadUserInfo.confirmName(req.slot('Name'), res);
                res.say(prompt).shouldEndSession(false).send();
            }
        }); //end loadUserInfo()
        
        //async call -> should return false
        return false;
    }
    
    console.log("nameIntent()");
    //nameIntent with state (LoadRequest)
    switch(req.sessionAttributes.previousState) {

        // intent did not trigger at start-up -> triggered at launchRequest
        case "nameNotFound":
            var prompt = loadUserInfo.confirmName(req.slot('Name'), res);
            res.say(prompt).shouldEndSession(false);

            //get the car|bus option
            /*var opt = req.slot('Options');
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
            });*/

            //return false immediately so alexa-app doesn't send the response
            //and waits for the async call above to return the response
            break;
    }
    return true;
};

