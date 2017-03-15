
'use strict';
var https = require('https');

function getTraffic(options, getTrafficCallback)
{
  var reqCallback = function(response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      var file = JSON.parse(str);
      var duration = file.routes[0].legs[0].duration.value;
      //pass duration back to caller through the callback function
      getTrafficCallback(duration);
    });
  };

  var req = https.request(options, reqCallback);

  req.end();
}

function getLiveTraffic(options, getTrafficCallback)
{
  var reqCallback = function(response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      var file = JSON.parse(str);
      var duration = file.rows[0].elements[0].duration_in_traffic.value;
      //pass duration back to caller through the callback function
      getTrafficCallback(duration);
    });
  };

  var req = https.request(options, reqCallback);

  req.end();
}

function getDirections(options, getDirectionsCallback)
{
  var reqCallback = function(response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      var file = JSON.parse(str);
      var directions = file.routes[0].summary;
      console.log(directions);
      //pass duration back to caller through the callback function
      getDirectionsCallback(directions);
    });
  };

  var req = https.request(options, reqCallback);

  req.end();
}

function getTransitDirections(options, getDirectionsCallback)
{
  var reqCallback = function(response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      var file = JSON.parse(str);
      var firstBus = file.routes[0].legs[0].steps[1].transit_details.line.short_name;
      console.log(firstBus);
      var secondeBus = file.routes[0].legs[0].steps[3].transit_details.line.short_name; //steps[3]
      console.log(secondeBus);
      var directions = "take bus, " + firstBus + " followed by bus, " + secondeBus;
      //pass duration back to caller through the callback function
      getDirectionsCallback(directions);
    });
  };

  var req = https.request(options, reqCallback);

  req.end();
}

function getCocoTransitDirections(options, getDirectionsCallback)
{
  var reqCallback = function(response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      var file = JSON.parse(str);
      var firstBus = file.routes[0].legs[0].steps[1].transit_details.line.short_name;
      console.log(firstBus);
      var secondeBus = file.routes[0].legs[0].steps[3].transit_details.line.short_name; //steps[3]
      console.log(secondeBus);
      var directions = "take bus, " + firstBus + " followed by bus, " + secondeBus;
      //pass duration back to caller through the callback function
      getDirectionsCallback(directions);
    });
  };

  var req = https.request(options, reqCallback);

  req.end();
}



// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function( event, context ) {

    var options_car_danny = {
        host: 'maps.googleapis.com',
        path: '/maps/api/distancematrix/json?origins=1585+Richelieu+Brossard+Quebec&destinations=900+Riverside+Saint-Lambert&departure_time=now&key=AIzaSyCmZYBGNZw_Tkej-NwnCoEnzTwCy1lr4sg',
    };
    var options_car_directions_danny = {
        host: 'maps.googleapis.com',
        path: '/maps/api/directions/json?origin=1585+Richelieu+Brossard+Quebec&destination=900+Riverside+Saint-Lambert&mode=driving&key=AIzaSyCmZYBGNZw_Tkej-NwnCoEnzTwCy1lr4sg',
    };
    var options_bus_danny = {
        host: 'maps.googleapis.com',
        path: '/maps/api/directions/json?origin=1585+Richelieu+Brossard+Quebec&destination=900+Riverside+Saint-Lambert&mode=transit&key=AIzaSyCmZYBGNZw_Tkej-NwnCoEnzTwCy1lr4sg',
    };
    var options_car_nick = {
        host: 'maps.googleapis.com',
        path: '/maps/api/distancematrix/json?origins=1585+Richelieu+Brossard+Quebec&destinations=180+Peel+Montreal&departure_time=now&key=AIzaSyCmZYBGNZw_Tkej-NwnCoEnzTwCy1lr4sg',
    };
    var options_car_directions_nick = {
        host: 'maps.googleapis.com',
        path: '/maps/api/directions/json?origin=1585+Richelieu+Brossard+Quebec&destination=180+Peel+Montreal&mode=driving&key=AIzaSyCmZYBGNZw_Tkej-NwnCoEnzTwCy1lr4sg',
    };
    var options_bus_nick = {
        host: 'maps.googleapis.com',
        path: '/maps/api/directions/json?origin=1585+Richelieu+Brossard+Quebec&destination=180+Peel+Montreal&mode=transit&key=AIzaSyCmZYBGNZw_Tkej-NwnCoEnzTwCy1lr4sg',
    };
    var options_car_coco = {
        host: 'maps.googleapis.com',
        path: '/maps/api/distancematrix/json?origins=1585+Richelieu+Brossard+Quebec&destinations=1000+Marie-Victorin+Longueuil&departure_time=now&key=AIzaSyCmZYBGNZw_Tkej-NwnCoEnzTwCy1lr4sg',
    };
    var options_car_directions_coco = {
        host: 'maps.googleapis.com',
        path: '/maps/api/directions/json?origin=1585+Richelieu+Brossard+Quebec&destination=1000+Marie-Victorin+Longueuil&mode=driving&key=AIzaSyCmZYBGNZw_Tkej-NwnCoEnzTwCy1lr4sg',
    };
    var options_bus_coco = {
        host: 'maps.googleapis.com',
        path: '/maps/api/directions/json?origin=1585+Richelieu+Brossard+Quebec&destination=1000+Marie-Victorin+Longueuil&mode=transit&key=AIzaSyCmZYBGNZw_Tkej-NwnCoEnzTwCy1lr4sg',
    };
    
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        if (event.request.type === "LaunchRequest") {
           output("Daily Commute started. For who would you like to know the commute time?", context, false);
            
        } 
        
        else if (event.request.type === "IntentRequest" && event.request.intent.name == "TrafficIntent") {
            console.log("Inside IntentRequest");
            console.log(event.request.intent.slots.Destinations.value);
            
            switch ((String(event.request.intent.slots.Destinations.value)).toLowerCase() ) {
                
                case "danny" : 
                    console.log("Inside destinations");
                    switch ((String(event.request.intent.slots.Options.value)).toLowerCase() ) {

                        case "bus" : 
                            getTraffic(options_bus_danny, function(duration) {
                            output("Danny, your traffic duration by bus is " + String(Math.round(duration/60)) + "minutes", context, true);
                            });  
                            break;

                        default : 
                            getLiveTraffic(options_car_danny, function(duration) {
                            output("Danny, your traffic duration by car is " + String(Math.round(duration/60)) + "minutes", context, true);
                            });  
                            break;
                    }
                    break;
                    
                case "nick" : 
                    console.log("Inside destinations");
                    switch ((String(event.request.intent.slots.Options.value)).toLowerCase() ) {
                        case "bus" : 
                            getTraffic(options_bus_nick, function(duration) {
                            output("Nick, your traffic duration by bus is " + String(Math.round(duration/60)) + "minutes", context, true);
                            });  
                            break;
                        default : 
                            getLiveTraffic(options_car_nick, function(duration) {
                            output("Nick, your traffic duration by car is " + String(Math.round(duration/60)) + "minutes", context, true);
                            });  
                            break;

                    }
                    break;
                    
                case "coco" : 
                    console.log("Inside destinations");
                    switch ((String(event.request.intent.slots.Options.value)).toLowerCase() ) {

                        case "bus" : 
                            getTraffic(options_bus_coco, function(duration) {
                            output("Coco, your traffic duration by bus is " + String(Math.round(duration/60)) + "minutes", context, true);
                            });  
                            break;

                        default : 
                            getLiveTraffic(options_car_coco, function(duration) {
                            output("Coco, your traffic duration by car is " + String(Math.round(duration/60)) + "minutes", context, true);
                            });  
                            break;
                    }
                    break;
                    
                default : output("Sorry, I didn't catch your name. Please try again.", context, false);
            }
        }
        
         else if (event.request.type === "IntentRequest" && event.request.intent.name == "DirectionsIntent") {
            console.log("Inside IntentRequest");
            console.log(event.request.intent.slots.Destinations.value);
            
            switch ((String(event.request.intent.slots.Destinations.value)).toLowerCase() ) {
                
                case "danny" : 
                    console.log("Inside directions");
                    switch ((String(event.request.intent.slots.Options.value)).toLowerCase() ) {
                        
                        case "bus" : 
                            getTransitDirections(options_bus_danny, function(directions) {
                            output("Danny, your traffic directions by bus are:" + String(directions), context, true);
                            });
                            break;

                        default : 
                            getDirections(options_car_directions_danny, function(directions) {
                            output("Danny, your traffic directions by car are: " + String(directions), context, true);
                            });
                            break;
                    }
                    break;
                    
                case "nick" : 
                    console.log("Inside directions");
                    switch ((String(event.request.intent.slots.Options.value)).toLowerCase() ) {
                        
                        case "bus" : 
                            getTransitDirections(options_bus_nick, function(directions) {
                            output("Nick, your traffic directions by bus are:" + String(directions), context, true);
                            });
                            break;

                        default : 
                            getDirections(options_car_directions_nick, function(directions) {
                            output("Nick, your traffic directions by car are:" + String(directions), context, true);
                            });
                            break;
                    }
                    break;
                    
                case "coco" : 
                    console.log("Inside directions");
                    switch ((String(event.request.intent.slots.Options.value)).toLowerCase() ) {

                        case "bus" : 
                            getCocoTransitDirections(options_bus_coco, function(directions) {
                            output("Coco, your traffic directions by bus are:" + String(directions), context, true);
                            });
                            break;

                        default : 
                            getDirections(options_car_directions_coco, function(directions) {
                            output("Coco, your traffic directions by car are:" + String(directions), context, true);
                            });
                            break;
                    }
                    break;
                    
                default : output("Sorry, I didn't catch your name. Please try again.", context, false);
            }
        }
        
        else if (event.request.type === "IntentRequest" && event.request.intent.name == "SpeechIntent") {
            output("Speech in progress", context, true);
            
            /*POST /v1/avs/speechrecognizer/recognize HTTP/1.1;
            Host: access-alexa-na.amazon.com;
            Authorization: Bearer*/
        }
        
        else if (event.request.type === "IntentRequest" && event.request.intent.name == "AMAZON.HelpIntent"){
            output("You can ask for traffic duration or directions by asking the: time for person name by car or bus", context, false);
        }
        
        else if (event.request.type === "IntentRequest" && event.request.intent.name == "DontKnowIntent") {
            output("Have a good day", context, true);
            
        } 
        
        else if (event.request.type === "SessionEndedRequest") {
            output("Skill sension ended", context, true);
            /*onSessionEnded(event.request, event.session);
            context.succeed();*/
        }
        
    } catch (e) {
        context.fail("Exception: " + e);
    }
   
};

function output( text, context, endSession) {

   var response = {

      outputSpeech: {

         type: "PlainText",

         text: text

      },

      card: {

         type: "Simple",

         title: "System Data",

         content: text

      },

   shouldEndSession: endSession

   };

   context.succeed( { response: response } );
}


/**
 * Called when the session starts.
 */
 
function onSessionStarted(sessionStartedRequest, session, callback) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // add any session init logic here
    
    var cardTitle = "Hello, this is your traffic report for today!";
    var speechOutput = "Tell me your name so I can give you your traffic report for today!";
    callback(session.attributes,
        buildSpeechletResponse(cardTitle, speechOutput, "I did not understand you", false));
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    var cardTitle = "Hello, this is your traffic report for today!";
    var speechOutput = "Tell me your name so I can give you your traffic report for today!";
    callback(session.attributes,
        buildSpeechletResponse(cardTitle, speechOutput, "I did not understand you", false));
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == 'TrafficIntent') {
        handleAnswerRequest(intent, session, callback);
    }
    else if (intentName == 'DontKnowIntent') {
        handeDontKnowRequest(intent, session, callback);
    }
    else {
        handleRequestError(intent, session, callback);
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}

function handleAnswerRequest(intent, session, callback) {
    var cardTitle = intent.name;
    var repromptText = "";
    var shouldEndSession = false;
    var speechOutput = "Sorry, I could not retrieve the traffic report.";

    var destinationsSlot = intent.slots.Destinations;
    
    /*if (destinationsSlot && destinationsSlot.value) {
        
        getTrafficDuration(destinationsSlot.value, function(data){
            
            console.log("Retrieved traffice duration for:" + destinationsSlot.value[1]);
            speechOutput = destinationsSlot.value + ", it will take you " + String(data/60) + " minutes to your destination.";
        });
    }*/
    
    callback(session.attributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function createNameAttributes(tempName) {
    return {
        name: tempName
    };
}

function handeDontKnowRequest(intent, session, callback) {
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Please repeat the name", "", false));
}

function handleRequestError(intent, session, callback) {
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("What did you say?", "", true));
}

// ------- Helper functions to build responses -------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {    //card
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}