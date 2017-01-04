'use strict';

//noIntent
exports.noIntentHandler = function(req,res) {

console.log("noIntent()");

    if(!req.session("previousState")){
        console.log("NoIntent() - no state found");
        res.session("previousState", "nameNotRecognized");
        var prompt = "Sorry, I did not recognize you. For who would you like to know the commute duration?";
        res.say(prompt).shouldEndSession(false); 
        return true;
    }

    return true;
};
