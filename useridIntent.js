'use strict';

// NameIntent
exports.useridIntentHandler = function(req,res){

console.log("UseridIntent()");

    if(!req.session("previousState")){
        console.log("UseridIntent() - no state found");
        res.session("previousState", "nameNotRecognized");
        var prompt = "Sorry, I did not recognize you. For who would you like to know the commute duration?";
        res.say(prompt).shouldEndSession(false); 
        return true;
    }

    res.session("previousState", "readingUserID");
    var prompt = "Hi there! Please take a pen and paper and get ready. Your user id is: "  + req.userId + ". Would you like me to repeat?";
    res.say(prompt).shouldEndSession(false);
    
    return true;
};
