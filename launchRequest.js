'use strict';
var loadUserInfo = require('./loadUserInfo');
var AWS = require('aws-sdk');

//credential profiles defined here: ~/.aws/credentials
//only for debuging
//use 'default' for production and udpload the folder
var AWS_CREDENTIALS_PROFILE = "ncstefan";


//launchRequest handler
exports.launchRequestHandler = function(req,res) {

    console.log("launchRequest()");

    res.session("previousState", "onLaunch");
    //load serviceadmin's account credentials from the credentials profiles file
    var credentials = new AWS.SharedIniFileCredentials({profile: AWS_CREDENTIALS_PROFILE});]
    console.log("AWS credentials: " + JSON.stringify(AWS.config.credentials));

    //assume the DynamoDB remote access role
    var params = {
        DurationSeconds: 3600, 
        ExternalId: "arn:aws:iam::615038862522:root", 
        RoleArn: "arn:aws:iam::824783492825:role/RemoteDynamoDBAccess", 
        RoleSessionName: "DevDebug"
    };
    var sts = new AWS.STS({region: 'us-east-1'})
    sts.assumeRole(params, function(err, data) {
        if (err){
            console.log("Error assuming role." + err, err.stack); // an error occurred
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
            console.log("connecting to DB using params: " + JSON.stringify(paramsDynamoDB) );
            //connect to the DB
            var db = new AWS.DynamoDB(paramsDynamoDB);

            //call the loadUserInfo function 
            loadUserInfo.loadUserInfo(db, req.userId, function(success, data) {
                if(!success) {
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
    });    

    return false;
};