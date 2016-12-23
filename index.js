var alexa = require('alexa-app');
var launchRequest = require('./launchRequest');
var trafficIntent = require('./trafficIntent');
var yesIntent = require('./yesIntent');
var noIntent = require('./noIntent');
var nameIntent = require('./nameIntent');
//var addresIntent = require('./addressIntent');
var useridIntent = require('./useridIntent');


// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// Define an alexa-app
app = new alexa.app('commute');
app.dictionary = {
    "names": [],    //["nick", "coco", "danny"],
    "orig": [],  //["1585+Richelieu+Brossard+Quebec", "1585+Richelieu+Brossard+Quebec", "1585+Richelieu+Brossard+Quebec"],
    "dest": []  //["180+Peel+Montreal+Quebec","1000+Marie-Victorin+Longueuil","900+Riverside+Saint-Lambert"]
}; 

// LaunchRequest
app.launch(launchRequest.launchRequestHandler);

// TrafficIntent
app.intent(
    'TrafficIntent', 
    {
        "slots": {"Destinations": "LIST_OF_NAMES","Options": "LIST_OF_OPTIONS"},
        "utterances": [
            "{time|} for {-|Destinations} by {-|Options}", 
            "{time|} for {-|Destinations}",
            "{time|} by {-|Options} for {-|Destinations}"
        ]
    },
    trafficIntent.trafficIntentHandler
);

// NameIntent
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

// AddressIntent
app.intent(
    'AddressIntent', 
    {
        "slots": {"Address": "AMAZON.PostalAddress"},
        "utterances": [
            "{the|my|} {home|commute|} {address|destination} is {-|Address}"
        ]
    },
    addresIntent.addressIntentHandler
);

// UserIDIntent
app.intent(
    'UserIDIntent', 
    {
        "slots": {},
        "utterances": [
            "{the|my|} {user|userID}"
        ]
    },
    useridIntent.useridIntentHandler
);


// YesIntent
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

// NoIntent
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

// Error
app.error = function(exception, request, response) {
    response.say("Sorry, something bad happened");
};

module.exports = app;