'use strict';

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
            res.session("previousState", "getTraffic");
            var name = req.slot('Name');
            var crtName = req.sessionAttributes["crtUser"];
            console.log("yesIntent() for: " + crtName);

            //get the car|bus option
            //var opt = req.slot('Options');
            //if (!opt) opt = "car";*/
            //var opt = "car";

            //ask again if name not found in the list
            if (app.dictionary.names.indexOf(crtName) == -1){
                var prompt = "Your name does not appear in the portal. Please register your userID in the registration portal.";
                res.say(prompt).shouldEndSession(false);
                res.send();

                //send card
                res.card({
                    type: "Standard",
                    title: "Here is your userID", // this is not required for type Simple
                    text: "Copy this:\n" + req.userId + "\nVisit the registration portal here:\n" + "http://alexacommuteinforeg.us-east-1.elasticbeanstalk.com" + "\nFollow these steps:\n1. Copy and paste your userID into the portal to have access to our services\n2. Provide the names of everyone in your household along with their home address and their destination address\n3. Now you can start using our services"
                });
                var prompt = "Welcome, check your alexa app, you will be provided with a card and some steps to follow.";
                res.say(prompt).shouldEndSession(true);
                res.send();
                return true;
            }

            //save the current user
            //res.session("crtUser", req.slot('Name'));

            //get commute duration for <name>
            commute_info.getLiveTraffic(crtName, function(duration) {
                res.say("Hello " + crtName + "! Your commute by car " + String(Math.round(duration/60)) + " minutes.").shouldEndSession(true);
                res.send();
            });

            //return false immediately so alexa-app doesn't send the response
            //and waits for the async call above to return the response
            break;
    }

    return false;
};
