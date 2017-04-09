'use strict';
var commute_info = require('./commute_info');
var loadUserInfo = require('./loadUserInfo');


//yesIntent
exports.yesIntentHandler = function(req,res) {

    if( typeof req.sessionAttributes == "undefined" ){
        console.log("YesIntent() - no state found");        
        //load user session (async function)
        loadUserInfo.loadUserSession(req.userId, res, function(err, data){
            if(err){}
            else{}
        }); //end - loadUserSession()        
        //async call -> should return false
        return false;
    }

    console.log("yesIntent()");
    switch(req.sessionAttributes.previousState) {
        
        case "confirmName":
            //get live traffic for the confirmed user and set session to "correctName" or "nameNotFound"
            return commute_info.getLiveTrafficForRoute( req, req.sessionAttributes["crtUser"], res );
            break;

        case "userFound":
            //state change
            res.session("previousState", "nameNotFound");
            //ask again prompt
            var nameList = commute_info.getNameList();
            if(!nameList){
                //no names registered -> send to registration portal and END session.
                var prompt = "Sorry, I couldn't find any registered destination routes. First, you will need to register your commute destinations on the registration portal. Simply follow the instructions on the card I sent to your Alexa application.";
                res.say(prompt).shouldEndSession(true);
            }
            else{
                //list registered routes and ask for name
                var prompt = "Please choose a name you registered a destination route for. You added routes for: " + nameList + ". For whom would you like to know the commute time? Say, my name is." ;
                res.say(prompt).shouldEndSession(false);
            }
            break;
    }

    return true;
};