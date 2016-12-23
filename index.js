var alexa = require('alexa-app');
var launchRequest = require('./launchRequest');
var yesIntent = require('./yesIntent');
var noIntent = require('./noIntent');
var nameIntent = require('./nameIntent');

//allow this module to be reloaded by hotswap when changed
module.change_code = 1;

//define an alexa-app
app = new alexa.app('commute');
app.dictionary = {
    "names": [],    //["nick", "coco", "danny"],
    "orig": [],  //["1585+Richelieu+Brossard+Quebec", "1585+Richelieu+Brossard+Quebec", "1585+Richelieu+Brossard+Quebec"],
    "dest": []  //["180+Peel+Montreal+Quebec","1000+Marie-Victorin+Longueuil","900+Riverside+Saint-Lambert"]
}; 

//launchRequest
app.launch(launchRequest.launchRequestHandler);

//nameIntent
app.intent(
    'NameIntent', 
    {
        "slots": {"Name": "LIST_OF_NAMES"},
        "utterances": [
            "{the|my|} name is {-|Name}",
            "{the|my|} name is {-|Name} by {-|Options}",
            "name is {-|Name}",
            "name is {-|Name} by {-|Options}"
        ]
    },
    nameIntent.nameIntentHandler
);

//yesIntent
app.intent(
    'YesIntent', 
    {
        "slots": {},
        "utterances": [
            "{yes|correct|yup|sure}"
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

//error
app.error = function(exception, request, response) {
    response.say("Sorry, something bad happened");
};

module.exports = app;