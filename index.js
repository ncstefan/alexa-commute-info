var alexa = require('alexa-app');
var launchRequest = require('./launchRequest');
var yesIntent = require('./yesIntent');
var noIntent = require('./noIntent');
var nameIntent = require('./nameIntent');
var stopIntent = require('./stopIntent');
var helpIntent = require('./helpIntent');

//allow this module to be reloaded by hotswap when changed
//module.change_code = 1;

//define an alexa-app
app = new alexa.app('commute');
app.dictionary = {
    "names": [],    //["nick", "coco", "danny"],
    "orig": [],  //["1585+Richelieu+Brossard+Quebec", "1585+Richelieu+Brossard+Quebec", "1585+Richelieu+Brossard+Quebec"],
    "dest": []  //["180+Peel+Montreal+Quebec","1000+Marie-Victorin+Longueuil","900+Riverside+Saint-Lambert"]
}; 

//launchRequest
app.launch(launchRequest.launchRequestHandler);

// NameIntent
app.intent(
    'NameIntent', 
    {
        "slots": {"Name": "AMAZON.Person"},
        "utterances": [
            "{|what is} the {|commute} time for {-|Name}",
            "{|what is} the commute for {-|Name}",
            "to give me the commute time for {-|Name}",
            "{the|my|} name is {-|Name}",
            "name is {-|Name}",
            "for {-|Name}",
            "{-|Name}"
        ]
    },
    nameIntent.nameIntentHandler
);

// YesIntent
app.intent(
    'YesIntent', 
    {
        "slots": {},
        "utterances": [
            "{yes|correct|yup|sure|absolutely}"
        ]
    },
    yesIntent.yesIntentHandler
);

//noIntent
app.intent(
    'NoIntent', 
    {
        "slots": {},
        "utterances": [
            "{no|nope|nah|incorrect}"
        ]
    },
    noIntent.noIntentHandler
);

//StopIntent
app.intent(
    'AMAZON.StopIntent', 
    {
        "slots": {},
        "utterances": []
    },
    stopIntent.stopIntentHandler
);

//CancelIntent
app.intent(
    'AMAZON.CancelIntent', 
    {
        "slots": {},
        "utterances": []
    },
    stopIntent.stopIntentHandler
);

//HelpIntent
app.intent(
    'AMAZON.HelpIntent', 
    {
        "slots": {},
        "utterances": []
    },
    helpIntent.helpIntentHandler
);

//error
app.error = function(exception, request, response) {
    console.log("generic error handling");
    response.say("Sorry, something bad happened. Please try again.").send();
};

app.pre = function(request, response, type) {
//   if (request.applicationId != "amzn1.ask.skill.080952e4-62cc-4e91-86df-0bb7a742cc05") {
//     // fail ungracefully 
//     response.fail("Invalid applicationId");
//   }
};

module.exports = app;