'use strict';

//noIntent
exports.helpIntentHandler = function(req,res) {

    if( typeof req.sessionAttributes == "undefined" ){
        console.log("HelpIntent() - no state found");
        var prompt = "Hi there. You need to register your location and up to four comute destinations before you start. Please start by following the instructions in the aplication card I sent you. Afterwards, you can ask Comute Info for the duration of any of the registered person's commute routes. For example, to get John's commute time say: Alexa, ask commute for John";
        res.say(prompt).shouldEndSession(true); 
        return true;
    }    

    console.log("helpIntent()");
    res.session("previousState", "nameNotFound");
    var prompt = "Hi there. You can ask Daily Commute for the duration of any of the registered person's commute routes. For example, to get the commute time for John Smith say: my name is John Smith.";
    res.say(prompt).shouldEndSession(false); 
    return true;        
};
