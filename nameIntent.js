'use strict';

// NameIntent
exports.nameIntentHandler = function(req,res){

console.log("NameIntent()");

    if(!req.session("previousState")){
        console.log("NameIntent() - no state found");
        res.shouldEndSession(false);
        return true;
    }
    
    switch(req.sessionAttributes.previousState){

        // Traffic intent did not trigger at start-up
        case "nameNotRecognized": 
            var name = req.slot('Name');
            res.session("previousState", "nameInput");
            res.session("crtUser", name);
            var prompt = "Nice to meet you " + name + ". Did I pronounce your name properly?";
            res.say(prompt).shouldEndSession(false);
            break;

    }
    return true;
};
