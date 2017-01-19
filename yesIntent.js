'use strict';
var commute_info = require('./commute_info');

try {

    //yesIntent
    exports.yesIntentHandler = function(req,res) {

    console.log("yesIntent()");

        if(!req.session("previousState")){
            console.log("YesIntent() - no state found");        
            res.session("previousState", "nameNotRecognized");
            var prompt = "Sorry, I did not recognize you. For who would you like to know the commute duration?";
            res.say(prompt).shouldEndSession(false); 
            return true;
        }

        switch(req.sessionAttributes.previousState) {
            case "confirmName":
                res.session("previousState", "correctName");

                var crtName = req.sessionAttributes["crtUser"];
                console.log("Processing yesIntent() for: " + crtName);
                console.log(crtName + ".");
                console.log(app.dictionary);

                //ask again if name not found in the list
                if (app.dictionary.names.indexOf(crtName) == -1) {
                    //user record not found
                    /*var prompt = "Your name and your destination route are not registered. Please follow the instructions you received in the application card to register on the Commute Info's application portal.";
                    res.say(prompt).shouldEndSession(false).send();

                    //send card
                    res.card({
                        type: "Standard",
                        title: "Here is your userID", // this is not required for type Simple
                        text: "Copy this:\n" + req.userId + "\nVisit the registration portal here:\n" + "http://alexacommuteinforeg.us-east-1.elasticbeanstalk.com" + "\nFollow these steps:\n1. Copy and paste your userID into the portal to have access to our services\n2. Provide the names of everyone in your household along with their home address and their destination address\n3. Now you can start using our services"
                    });                
                    return true;*/
                    
                    //list all names
                    var namelist = '';
                    var idx = 0;
                    if (app.dictionary.names.length == 1) {
                        //single name/destination
                        namelist = namelist + app.dictionary.names[0];
                    }
                    else {
                        //multiple names/destinations
                        app.dictionary.names.forEach(function(element) {
                            if (idx == app.dictionary.names.length - 1) {
                                namelist += " and " + element;
                            }
                            else if (idx == 0) {
                                namelist += element;
                                idx++;
                            }
                            else {
                                namelist += ", " + element;
                                idx++;
                            }
                        }); 
                    }

                    //state change
                    res.session("previousState", "nameNotFound");
                    //list registered names
                    console.log("Registered destination routes: " + namelist);
                    var prompt = "It seems like your name is not registered in your portal. Please choose a name listed in your portal. You added destination routes for: " + namelist + ". For who would you like to know the commute time? Say, my name is." ;
                    res.say(prompt).shouldEndSession(false).send();
                }
                else {
                    //retrieve commute duration for <name>
                    console.log("else statement");
                    commute_info.getLiveTraffic(crtName, function(duration) {
                        res.say("Hello " + crtName + "! Your commute by car is: " + String(Math.round(duration/60)) + " minutes.");
                        res.shouldEndSession(true).send();
                    });
                }

                //return false immediately so alexa-app doesn't send the response
                //and waits for the async call above to return the response
                break;

                case "userFound":
                    res.session("previousState", "nameNotFound");
                    console.log("state: nameNotFound");
                    //list all names
                    var namelist = '';
                    var idx = 0;
                    if (app.dictionary.names.length == 1) {
                        //single name/destination
                        namelist = namelist + app.dictionary.names[0];
                    }
                    else {
                        //multiple names/destinations
                        app.dictionary.names.forEach(function(element) {
                            if (idx == app.dictionary.names.length - 1) {
                                namelist += " and " + element;
                            }
                            else if (idx == 0) {
                                namelist += element;
                                idx++;
                            }
                            else {
                                namelist += ", " + element;
                                idx++;
                            }
                        }); 
                    }

                    //state change
                    res.session("previousState", "nameNotFound");
                    //list registered names
                    console.log("Registered destination routes: " + namelist);
                    var prompt = "And you added destination routes for: " + namelist + ". For who would you like to know the commute time? Say, my name is." ;
                    res.say(prompt).shouldEndSession(false).send();
        }

        return false;
    };

}

catch(err) {
    console.log("error handling: yesIntent()")
    res.say("Something went terribly wrong. Please try again.").shouldEndSession(true).send();
}