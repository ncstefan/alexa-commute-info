'use strict';
var loadUserInfo = require('./loadUserInfo');
var AWS = require('aws-sdk');

//launchRequest handler
exports.launchRequestHandler = function(req,res) {

    console.log("launchRequest()");

    res.session("previousState", "onLaunch");
    //console.log("state: " + req.sesssionAttributes.previousState);

    var db = new AWS.DynamoDB({region: 'us-east-1'});

    //call the loadUserInfo function 
    loadUserInfo.loadUserInfo(db, req.userId, function(success, data) {
        if(!success) {
            //user record not found
            res.session("previousState", "userNotFound");
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
            res.session("previousState", "userFound");
            console.log("Found userID in DB: "+ JSON.stringify(data));

            var prompt = "Hello, I found your registration record. Is this your home address: " + data.Item.alexaLocation.S + "?";   //make it a question (y/n)
            res.say(prompt).shouldEndSession(false).send();
        }
    })

    return false;
};