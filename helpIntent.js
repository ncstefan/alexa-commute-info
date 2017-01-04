'use strict';

//noIntent
exports.helpIntentHandler = function(req,res) {

    console.log("helpIntent()");


    if(!req.session("previousState")){
        console.log("HelpIntent() - no state found");
        res.session("previousState", "nameNotRecognized");
        var prompt = "Hi there. Please start by following the instructions in the aplication card in order to register your Alexa location and up to four comute destinations. Afterwards you can ask Comute Info for the duration of any of the registered persons commute. For example, to get John's commute time say: Alexa, ask commute for John";
        res.say(prompt).shouldEndSession(false); 
        return true;
    }    
    var prompt = "";
    res.say(prompt).shouldEndSession(false); 
    return true;
};
