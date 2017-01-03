'use strict';

//yesIntent
exports.yesIntentHandler = function(req,res) {

console.log("yesIntent()");

    if(!req.session("previousState")){
        console.log("YesIntent() - no state found");        
        res.session("previousState", "nameNotRecognized");
        var prompt = "Sorry, I did not recognize you. For who would you like to know the commute duration?";
        res.say(prompt).shouldEndSession(false); 
        return true;
    }

    return true;
};
