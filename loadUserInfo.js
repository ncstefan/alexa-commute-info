'use strict'
var AWS = require('aws-sdk');
var fs  = require('fs');
var path = require('path');


function trimUserID(userID){
    var s = userID.split('.');
    return s[s.length-1];
}

function updateSessionDict( data ){
        console.log(JSON.stringify(data));
        
        //populate dictionary with names
        app.dictionary.names = [];
        for (var i = 0; i < data.Item.names.L.length; i++) {
            app.dictionary.names.push(data.Item.names.L[i].M.Name.S.toLowerCase());
        }

        //populate dictionary with home address
        app.dictionary.orig = [];
        app.dictionary.orig.push(data.Item.alexaLocation.S);

        //populate dictionary with destination address
        app.dictionary.dest = [];
        for (var i = 0; i < data.Item.names.L.length; i++) {
            app.dictionary.dest.push(data.Item.names.L[i].M.Address.S);
        }
}

exports.confirmName = function (name, prompt, res){
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
        if( prompt ){
            //confirm user name
            console.log("Confirming name: " + caseName);
            return "You'd like to know the commute time for " + caseName + ". Correct?";
        }
        return caseName;
    }
    catch(err){
        //error... trigger nameIntent again
        res.session("previousState", "nameNotFound");
        if( prompt )
            return "Sorry, for whom would you like to know the commute time? Say, my name is:" ;
        return "";
    }
}

exports.loadUserInfo = function(userID, getUserInfoCallback) {       

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
                if( err ){
                    //error reading DB record
                    console.log('error in loading user information');
                    getUserInfoCallback(err, null);
                }
                else{
                    //read
                    if( typeof data.Item === "undefined" ){
                        //user not found
                        console.log('user not found: ' +userID);
                        //try the short version w/o prefix "amzn1.ask.account."
                        var uid = trimUserID( userID );
                        console.log('trying the short version of userID: ' + uid );
                        var params = {
                            TableName : "alexacommute_sign_up",
                            Key : {
                                alxID : {
                                    'S' : uid
                                }
                            }
                        }
                        db.getItem( params, function(err, data) {                            
                            if( err ){
                                //error reading DB record
                                console.log('error in loading user information - short version');
                                getUserInfoCallback(err, null);
                            }
                            else{
                                if( typeof data.Item === "undefined" ){
                                    //user not found
                                    console.log( 'short version not found' );
                                    //user not found 
                                    getUserInfoCallback( new Error('No user found!'), null );
                                }
                                else{  
                                    //user found
                                    console.log("success in loading user information - short version");
                                    try{
                                        
                                        updateSessionDict( data );
                                        //return success: true
                                        getUserInfoCallback( null, data );
                                    }
                                    catch( err ){
                                        //pass error to consumer
                                        console.log("error in getItem() callback: " + err.message); 
                                        getUserInfoCallback( err, null );
                                    }

                                }
                            }
                        });//end getItem() - for the short version of userID
                    }
                    else{
                        //user found
                        console.log("success in loading user information");
                        try{
                            
                            updateSessionDict( data );
                            //return success: true
                            getUserInfoCallback( null, data );
                        }
                        catch( err ){
                            //pass error to consumer
                            console.log("error in getItem() callback: " + err.message); 
                            getUserInfoCallback( err, null );
                        }
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