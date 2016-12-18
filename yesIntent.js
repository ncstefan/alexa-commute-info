'use strict';

// YesIntent
exports.yesIntentHandler = function(req,res){

console.log("YesIntent()");

    if(!req.session("previousState")){
        res.shouldEndSession(false);
        return true;
    }

    switch(req.sessionAttributes.previousState){

        // Traffic intent did not trigger at start-up
        case "acquaintance": 
            res.session("previousState", "nameRecognized");
            var prompt = "Sorry, I did not recognize you. For who would you like to know the commute duration?";
            res.say(prompt).shouldEndSession(false);
            break;
        
        // New name was introduced
        case "nameInput":
            // Add new dictionary entry for the new person
            app.dictionary.names.push(req.sessionAttributes.crtUser);
            app.dictionary.dest.push(req.sessionAttributes.crtUser);
            app.dictionary.orig.push(req.sessionAttributes.crtUser);

            res.session("previousState", "nameAccepted");
            var prompt = "Great! Now, I would need to know what your home address is? Start with: my address is.";
            res.say(prompt).shouldEndSession(false);
            break;

        case "homeAddressInput":
            // Update the origin address in the dictionary 
            app.dictionary.orig[app.dictionary.names.indexOf(req.sessionAttributes.crtUser)] = req.sessionAttributes.crtOrigAddress.replace(/ /g, "+");

            res.session("previousState", "homeAddressAccepted");
            var prompt = "Ok " + req.sessionAttributes.crtUser + ", what is the destination address of your usual commute? Start with: my destination is.";
            res.say(prompt).shouldEndSession(false);
            break;

        case "commuteAddressInput":
            // Update the origin address in the dictionary 
            app.dictionary.dest[app.dictionary.names.indexOf(req.sessionAttributes.crtUser)] = req.sessionAttributes.crtDestAddress.replace(/ /g, "+");

            res.session("previousState", "commuteAddressAccepted");
            var namelist = '';
            var idx = 0;
            app.dictionary.names.forEach(function(element) {
                if(++idx < app.dictionary.names.length)
                    namelist = namelist + element + ",";
                else
                    namelist = namelist + " and " + element;
            });        
            var prompt = "Ok " + req.sessionAttributes.crtUser + ", I memorized your coordinates. I now know: " + namelist + ". Who would you like the traffic report for?";
            res.say(prompt).shouldEndSession(false);
            break;

        case "readingUserID":
            // Repeat user id 
            var prompt = "Ok, here is your user id:" + req.userId + ". Would you like me to repeat?"
            res.say(prompt).shouldEndSession(false);
            break;
    }
    return true;
};
