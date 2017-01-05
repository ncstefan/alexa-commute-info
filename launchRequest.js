'use strict';
var loadUserInfo = require('./loadUserInfo');
var AWS = require('aws-sdk');

//launchRequest handler
exports.launchRequestHandler = function(req,res) {

    console.log("launchRequest()");

    res.session("previousState", "loadingUserInfo");
    //console.log("state: " + req.sesssionAttributes.previousState);

    var db = new AWS.DynamoDB({region: 'us-east-1'});

    //call the loadUserInfo function 
    loadUserInfo.loadUserInfo(db, function(success, data) {
        if(!success) {
            //user record not found
            var prompt = "We haven't met before. Welcome to the Commute Info. First, you will need to register your Alexa location and the commute destinations on the registration portal. Simply follow the instructions on the card I just sent to your Alexa application.";
            res.say(prompt).shouldEndSession(false);
            res.send();

            //send card
            res.card({
                type: "Standard",
                title: "Here is your userID", // this is not required for type Simple
                text: "Copy this:\n" + req.userId + "\nVisit the registration portal here:\n" + "http://alexacommuteinforeg.us-east-1.elasticbeanstalk.com" + "\nFollow these steps:\n1. Copy and paste your userID into the portal to have access to our services\n2. Provide the names of everyone in your household along with their home address and their destination address\n3. Now you can start using our services"
            });
        }
        else{
            //user found
            console.log("Found table in DB");
            console.log("Found userID in DB: "+ JSON.stringify(data));
            
            //state change 
            res.session("previousState", "validatingAddress");
      
            var prompt = "Hello, I found your registration record. Your address is: " + data.Item.alexaLocation.S + ".";   //make it a question (y/n)
            res.say(prompt).shouldEndSession(false).send();

            //list all names
            var l = app.dictionary.names.length;
            console.log(l);
            var namelist = '';
            var idx = 0;

//needs review ??? - loop required
            if (l == 1) {
                namelist = namelist + app.dictionary.names[0];
            }
            else {
                app.dictionary.names.forEach(function(element) {
                    if (idx < app.dictionary.names.length) {
                        namelist = namelist + element + ",";
                        idx++;
                    }
                    else {
                        namelist = namelist + " and " + element;
                        idx++;
                    }
                }); 
            }

            //state change
            res.session("previousState", "validatingName");
            console.log("Registered destination routes:" + namelist + ".");
            var prompt = "And you added destination routes for: " + namelist + ". For who would you like to know the commute time? Say, my name is." ;
            res.say(prompt).shouldEndSession(false).send();
        }
    })

    return false;
};