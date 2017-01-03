'use strict';
var AWS = require('aws-sdk');

//launchRequest handler
exports.launchRequestHandler = function(req,res) {

console.log("LaunchRequest()");

    res.session("previousState", "loadingUserInfo")

    var db = new AWS.DynamoDB({region: 'us-east-1'});
    
    var params = {
        TableName : "alexacommute_sign_up" /*+ "ABC"*/,
        Key : {
            alxID : {
                'S' : "amzn1.ask.account.AEZZJ3JVFHBTCTX7OREACSPKWXHUL4OI4ST2KOV2PGXZAO6ZOJNT6L46CD7MXYVKTSHDQ7YT2HHWPM7MX4TU2ATEMR5CBQQWQ25ETTMOD2UQCEMOX3IYA7HEEFSRG5L3JJN4B46DS4WPF2RDH2XEFT7V7E6GARFAHJIII7RUY6NF62VPFKFZYS6XSH3EE37RLCM53J7UX4XYULA"
                //req.userId
            }
        }
    }

    db.getItem(params, function(err, data) {
        if (err) {
            console.log("Error getting item from DB: " + err);
            console.log("Data: " + data)
            var prompt = "We haven't met before. Please register your userID in the registration portal.";
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
        }
        else if (data.Item == undefined) {
            console.log("Error getting item from DB: " + err);
            console.log("Data: " + data)
            var prompt = "We haven't met before. Please register your userID in the registration portal.";
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
        }
        else { 
            console.log("Found table in DB");
            console.log("Found userID in DB: "+ JSON.stringify(data));
            
            var prompt = "Hello, I found your registration record. This is your address: " + data.Item.alexaLocation.S + ".";   //make it a question (y/n)
            res.say(prompt).shouldEndSession(false);
            res.send();

            //populate dictionary with names
            app.dictionary.names.push(data.Item.name1.S);
            console.log(app.dictionary.names.indexOf(data.Item.name1.S));
            console.log(app.dictionary.names[0]);

            //populate dictionary with home address
            app.dictionary.orig.push(data.Item.alexaLocation.S);
            console.log(app.dictionary.orig.indexOf(data.Item.alexaLocation.S));
            console.log(app.dictionary.orig[0]);

            //populate dictionary with destination address
            app.dictionary.dest.push(data.Item.address1.S);
            console.log(app.dictionary.dest.indexOf(data.Item.address1.S));
            console.log(app.dictionary.dest[0]);

            //list all names
            var l = app.dictionary.names.length;
            console.log(l);
            var namelist = '';
            var idx = 0;

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

            console.log("Here is the list of names recorded in your portal, " + namelist + ".");
            var prompt = "Here is the list of names recorded in your portal, " + namelist + ". For which one would you like to get the commute time? Say my name is." ;
            res.say(prompt).shouldEndSession(false);
            res.send();
        }
    });

    return false;
};