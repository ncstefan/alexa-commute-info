'use strict';
var loadUserInfo = require('./loadUserInfo');
var AWS = require('aws-sdk');
var fs  = require('fs');
var path = require('path');

//credential profiles defined here: ~/.aws/credentials
//only for debuging
//use 'ncstefan' for production and 'dany' for troubleshooting on dany's account
var AWS_CREDENTIALS_PROFILE = "dany_credentials";
    //launchRequest handler
exports.launchRequestHandler = function(req,res) {

    console.log("launchRequest()");

    res.session("previousState", "onLaunch");
    //load serviceadmin's account credentials from the config file 
    //update the file with dany's keys for debugging
    //Read config values from a JSON file.
    var config = fs.readFileSync(path.resolve(__dirname, 'aws_credentials.json'), 'utf8');
    config = JSON.parse(config);
    console.log("Loaded credentials from file: "+ JSON.stringify(config));
    AWS.config.credentials = new AWS.Credentials({ 
                accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey, sessionToken: ''
                            });
    console.log("AWS credentials: " + JSON.stringify(AWS.config.credentials));
    console.log("AWS credentials.sessionKey: " + AWS.config.credentials.secretAccessKey);

    //assume the DynamoDB remote access role
    var params = {
        DurationSeconds: 3600, 
        ExternalId: "arn:aws:iam::615038862522:root", 
        RoleArn: "arn:aws:iam::824783492825:role/RemoteDynamoDBAccess", 
        RoleSessionName: "DevDebug"
    };
    var sts = new AWS.STS({region: 'us-east-1'});
    sts.assumeRole(params, function(err, data) {
        if (err){
            // an error occurred
            console.log("Error assuming role." + err, err.stack); 
            var prompt = "I'm sorry. I have trouble connecting. Please try again later?";
            res.say(prompt).shouldEndSession(true).send();
        }
        else{
            console.log("Assumed a new role: " + JSON.stringify(data)); 
            //use new role's credentials
            var paramsDynamoDB = {
                region: 'us-east-1',
                credentials: {
                    accessKeyId: data.Credentials.AccessKeyId,
                    secretAccessKey: data.Credentials.SecretAccessKey,
                    sessionToken: data.Credentials.SessionToken
                }
            };
            //connect to the DB
            console.log("connecting to DB using params: " + JSON.stringify(paramsDynamoDB) );
            var db = new AWS.DynamoDB(paramsDynamoDB);

            //call the loadUserInfo function 
            loadUserInfo.loadUserInfo(db, req.userId, function(err, data) {
                if(err) {
                    //user record not found
                    res.session("previousState", "userNotFound");
                    var prompt = "We haven't met before. Welcome to the Commute Info. First, you will need to register your Alexa location and the commute destinations on the registration portal. Simply follow the instructions on the card I just sent to your Alexa application.";
                    res.say(prompt).shouldEndSession(false).send();

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
        }     
    }); //assumeRole()

    //async intent handler
    return false;
}
