'use strict';

//noIntent
exports.helpIntentHandler = function(req,res) {

    console.log("helpIntent()");


    if(!req.session("previousState")){
        console.log("HelpIntent() - no state found");
        var prompt = "Hi there. You need to register your location and up to four comute destinations before you start. Please start by following the instructions in the aplication card I sent you. Afterwards, you can ask Comute Info for the duration of any of the registered person's commute routes. For example, to get John's commute time say: Alexa, ask commute for John";
        res.say(prompt).shouldEndSession(true); 
        return true;
    }    

    res.session("previousState", "nameNotRecognized");
    var prompt = "Hi there. If you already registered your Alexa's location and your comute destinations, you can ask Comute Info for the duration of any of the registered person's commute routes. For example, to get John's commute time say: Alexa, ask commute for John";
    res.say(prompt).shouldEndSession(true); 
    return true;        
};
