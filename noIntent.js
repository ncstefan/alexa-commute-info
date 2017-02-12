'use strict';
var loadUserInfo = require('./loadUserInfo');

//noIntent
exports.noIntentHandler = function(req,res) {

console.log("noIntent()");

    if(!req.session("previousState")){
        console.log("NoIntent() - no state found");
        //load user session (async function)
        loadUserInfo.loadUserSession(req.userId, res, function(err, data){
            if(err){}
            else{}
        }); //end - loadUserSession()        
        //async call -> should return false
        return false;
    }

    switch(req.sessionAttributes.previousState) {
        case "userFound":
            res.session("previousState", "addressNotFound");
            console.log("state: addressNotFound");

            var prompt = "It seems like your home address does not match with the one in the portal. First, you will need to register your Alexa location and the commute destinations on the registration portal. Simply follow the instructions on the card I just sent to your Alexa application.";
            res.say(prompt).shouldEndSession(true);

            //send card
            res.card({
                type: "Standard",
                title: "Here is your userID", // this is not required for type Simple
                text: "Copy this:\n" + req.userId + "\nVisit the registration portal here:\n" + "http://alexacommuteinforeg.us-east-1.elasticbeanstalk.com" + "\nFollow these steps:\n1. Copy and paste your userID into the portal to have access to our services\n2. Provide the names of everyone in your household along with their home address and their destination address\n3. Now you can start using our services"
            });
            break;

        case "confirmName":
            res.session("previousState", "nameNotFound");
            console.log("noIntent(): nameNotFound");

            var prompt = "Sorry, I did not understand your name correctly. Please repeat. Say, my name is:";
            res.say(prompt).shouldEndSession(false);
    }

    return true;
};