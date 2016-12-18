'use strict';

// NameIntent
exports.useridIntentHandler = function(req,res){

console.log("UseridIntent()");

    res.session("previousState", "readingUserID");
    var prompt = "Hi there! Please take a pen and paper and get ready. Your user id is: "  + req.userId + ". Would you like me to repeat?";
    res.say(prompt).shouldEndSession(false);
    
    return true;
};
