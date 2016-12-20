'use strict';

// NoIntent
exports.noIntentHandler = function(req,res){

console.log("NoIntent()");

    if(!req.session("previousState")){
        res.shouldEndSession(false);
        return true;
    }

    switch(req.sessionAttributes.previousState){

        // Traffic intent did not trigger at start-up
        case "acquaintance": 
            res.session("previousState", "nameNotRecognized");
            res.card({
                type: "Standard",
                title: "Here is your userID", // this is not required for type Simple
                text: "Copy this:\n " + req.userId + "\nVisit the registration portal here:\nhttp://alexacommuteinforeg.us-east-1.elasticbeanstalk.com\nFollow these steps:\n1. Copy and paste your userID into the portal to have access to our services\n2. Provide the names of people in your household along with their origin address and destination address"
            });
            var prompt = "Welcome, you will have to register through the portal. Check your alexa app, you will be provided with some steps to follow";
            res.say(prompt).shouldEndSession(false);
            break;

        case "nameInput":
            res.session("previousState", "nameNotRecognized");
            var prompt = "Sorry! I did not catch your name. Please start with: my name is.";
            res.say(prompt).shouldEndSession(false);
            break;

        case "homeAddressInput":
            res.session("previousState", "homeAddressNotRecognized");
            var prompt = "I'm sorry! I missunderstood your home address. Please try again and start with: my address is.";
            res.say(prompt).shouldEndSession(false);
            break;

        case "commuteAddressInput":
            res.session("previousState", "commuteAddressNotRecognized");
            var prompt = "I'm sorry! I missunderstood your commute destination. Please try again and start with: my destination is.";
            res.say(prompt).shouldEndSession(false);
            break;

        case "readingUserID":
            var prompt = "Great! Now you can proceed with the registration on the portal. See you there."
            res.say(prompt).shouldEndSession(true);
            break;        
    }
    return true;
};
