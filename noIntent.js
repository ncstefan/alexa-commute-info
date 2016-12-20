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
            var prompt = "Always happy to help new people with their commute duration and directions. What is your name? Say: my name is.";
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
