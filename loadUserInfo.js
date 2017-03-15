'use strict'
var AWS = require('aws-sdk');
var fs  = require('fs');
var path = require('path');

exports.confirmName = function (name, res){
    try{
        res.session("previousState", "confirmName");
        
        //upper case first (and) last name
        var names = name.split(" ");
        var caseName = "";
        names.forEach(function(element) {
            caseName += element.charAt(0).toUpperCase() + element.substr(1).toLowerCase() + " ";
        }, this);
        caseName =  caseName.trim();

        //save the current user
        res.session("crtUser", caseName);
        console.log("Confirming name: " + caseName);
        //confirm user name
        return "You'd like to know the commute time for " + caseName + ". Correct?";
    }
    catch(err){
        //error... trigger nameIntent again
        res.session("previousState", "nameNotFound");
        //list registered names
        return "Sorry, for whom would you like to know the commute time? Say, my name is:" ;
    }
}

exports.loadUserInfo = function(userID, getUserInfoCallback) {       //error handling userID var
    console.log("loading user data for:" + userID);

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
            getUserInfoCallback(err, null);
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

            var params = {
                TableName : "alexacommute_sign_up",
                Key : {
                    alxID : {
                        'S' : userID
                    }
                }
            }
            db.getItem(params, function(err, data) {
                // if ((err == undefined || err == null) && data.Item == undefined) {
                //     console.log("error in loading user information");
                //     getUserInfoCallback(null, null);
                // }
                // else if(data == null){
                //     console.log("user not found in DB: " + err);
                //     getUserInfoCallback(err, null);
                // }
                if( data == null ){
                    if( err != null ){
                        console.log('error in loading user information');
                        getUserInfoCallback(err, null);
                    }
                    else{
                        console.log('user not found');
                        getUserInfoCallback(new Error('No user found!'), null);
                    }
                }
                else {            
                    try{
                        console.log("success in loading user information");
                        console.log(JSON.stringify(data));
                        //console.log(data.Item.names.L[0]);
                        
                        //populate dictionary with names
                        app.dictionary.names = [];
                        for (var i = 0; i < data.Item.names.L.length; i++) {
                            app.dictionary.names.push(data.Item.names.L[i].M.Name.S.toLowerCase());
                        }
                        // console.log(app.dictionary.names.indexOf(data.Item.names.L[1].M.Name.S));
                        // console.log(app.dictionary.names[1]);

                        //populate dictionary with home address
                        app.dictionary.orig = [];
                        app.dictionary.orig.push(data.Item.alexaLocation.S);
                        // console.log(app.dictionary.orig.indexOf(data.Item.alexaLocation.S));
                        // console.log(app.dictionary.orig[0]);

                        //populate dictionary with destination address
                        app.dictionary.dest = [];
                        for (var i = 0; i < data.Item.names.L.length; i++) {
                            app.dictionary.dest.push(data.Item.names.L[i].M.Address.S);
                        }
                        // console.log(app.dictionary.dest.indexOf(data.Item.names.L[1].M.Address.S));
                        // console.log(app.dictionary.dest[1]);

                        //return success: true
                        getUserInfoCallback(null, data);
                    }
                    catch(err){
                        //pass error to consumer
                        console.log("Error in getItem() callback"); 
                        getUserInfoCallback(err, null);
                    }
                }
            }); //end getITem()
        }
    }); //end assumeRole()
}

//async function, Intent should return FALSE if using the function
exports.loadUserSession = function(userId, res, userSessionCallback){
    //call the loadUserInfo function 
    this.loadUserInfo(userId, function(err, data) {
        if(err) {
            //user record not found
            res.session("previousState", "userNotFound");
            var prompt = "We haven't met before. Welcome to the Daily Commute. First, you will need to register your Alexa location and the commute destinations on the registration portal. Simply follow the instructions on the card I just sent to your Alexa application.";
            res.say(prompt).shouldEndSession(true).send();

            //send card
            res.card({
                type: "Standard",
                title: "Welcome to Commute Info Service!", // this is not required for type Simple
                text: "Your userID is :\n" + userId + "\nTo register, visit the registration portal here:\n" + "http://alexacommuteinforeg.us-east-1.elasticbeanstalk.com" + "\nFollow these steps:\n1. Copy and paste your userID into the portal to have access to our services\n2. Provide the names of everyone in your household along with their home address and their destination address\n3. Now you can start using our services"
            });
            userSessionCallback(err,null);
        }
        else{
            //user record found
            console.log("Found userID in DB: "+ JSON.stringify(data));
            //no Name (function not called through nameIntent)
            res.session("previousState", "nameNotFound");
            var prompt = "Sorry, for whom would you like to know the commute time? Say, my name is:" ;
            res.say(prompt).shouldEndSession(false).send();
            userSessionCallback(null, null);
        }
    }); //end loadUserInfo()    
}