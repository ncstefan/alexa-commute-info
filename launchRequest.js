'use strict';
var loadUserInfo = require('./loadUserInfo');

//credential profiles defined here: ~/.aws/credentials
//only for debuging
//use 'ncstefan' for production and 'dany' for troubleshooting on dany's account
var AWS_CREDENTIALS_PROFILE = "dany_credentials";
    //launchRequest handler
exports.launchRequestHandler = function(req,res) {

    console.log("launchRequest()");

    res.session("previousState", "onLaunch");
 
    //call the loadUserInfo function 
    loadUserInfo.loadUserInfo(req.userId, function(err, data) {
        if(err) {
            //user record not found
            res.session("previousState", "userNotFound");
            var prompt = "We haven't met before. Welcome to the Daily Commute. First, you will need to register your Alexa location and the commute destinations on the registration portal. Simply follow the instructions on the card I just sent to your Alexa application.";
            res.say(prompt).shouldEndSession(false).send();

            //send card
            res.card({
                type: "Standard",
                title: "Welcome to Commute Info Service!", // this is not required for type Simple
                text: "Your userID is :\n" + req.userId + "\nTo register, visit the registration portal here:\n" + "http://alexacommuteinforeg.us-east-1.elasticbeanstalk.com" + "\nFollow these steps:\n1. Copy and paste your userID into the portal to have access to our services\n2. Provide the names of everyone in your household along with their home address and their destination address\n3. Now you can start using our services"
            });
        }
        else{
            //user found
            res.session("previousState", "userFound");
            console.log("Found userID in DB: "+ JSON.stringify(data));

            var prompt = "Hello, I found your registration record. Is this your home address: " + data.Item.alexaLocation.S + "?";   //make it a question (y/n)
            res.say(prompt).shouldEndSession(false).send();
        }
    }); //end loadUserInfo()
 
    //async intent handler
    return false;
}
