'use strict';

// AddressIntent
exports.addressIntentHandler = function(req,res){

console.log("AddressIntent()");

    if(!req.session("previousState")){
        res.shouldEndSession(false);
        return true;
    }
    
    switch(req.sessionAttributes.previousState){

        // Traffic intent did not trigger at start-up
        case "nameAccepted": 
        case "homeAddressNotRecognized":
            var address = req.slot('Address');
            res.session("previousState", "homeAddressInput");
            res.session("crtOrigAddress", address);
            var prompt = "Got it! You live at: " + address + ". Correct?";
            res.say(prompt).shouldEndSession(false);
            break;

        case "homeAddressAccepted":
        case "commuteAddressNotRecognized":
            var address = req.slot('Address');
            res.session("previousState", "commuteAddressInput");
            res.session("crtDestAddress", address);
            var prompt = "So, your usual commute destination is: " + address + ". Correct?";
            res.say(prompt).shouldEndSession(false);
            break;
    }
    return true;
};
