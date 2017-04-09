'use strict';
var loadUserInfo = require('./loadUserInfo');

//noIntent
exports.noIntentHandler = function(req,res) {

    if( typeof req.sessionAttributes == "undefined" ){
        console.log("NoIntent() - no state found");
        //load user session (async function)
        loadUserInfo.loadUserSession(req.userId, res, function(err, data){
            if(err){}
            else{}
        }); //end - loadUserSession()        
        //async call -> should return false
        return false;
    }

    console.log("noIntent()");
    switch(req.sessionAttributes.previousState) {
        case "userFound":
            res.session("previousState", "addressNotFound");
            console.log("state: addressNotFound");

            var prompt = "Ooops, it seems like your home address does not match with the one in the registration portal. First, you will need to register your Alexa location and the commute destinations. Simply follow the instructions on the card I just sent to your Alexa application.";
            res.say(prompt).shouldEndSession(true);

            //send card
            res.card({
                type: "Standard",
                title: "Welcome to Commute Info Service!", // this is not required for type Simple
                text: "Your userID is :\n" + req.userId + "\nTo register, visit the registration portal here:\n" + "http://alexacommuteinforeg.us-east-1.elasticbeanstalk.com" + "\nFollow these steps:\n1. Copy and paste your userID into the portal to have access to our service.\n2. Provide the names of everyone in your household along with their home address and their destination address.\n3. Now you can start using Daily Commute. To find out your commute time say:\n\nAlexa, ask Daily Commute what is the (commute) time for Jonh.\nAlexa, ask Daily Commute the commute (time) for John Smith."
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