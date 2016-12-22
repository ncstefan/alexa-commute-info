'use strict';
var AWS = require('aws-sdk');


//LaunchRequest handler
exports.launchRequestHandler = function(req,res) {

console.log("LaunchRequest()");

    res.session("previousState", "acquaintance")

    //AWS.config.update({region: 'us-east-1'});
    var db = new AWS.DynamoDB({region: 'us-east-1'});
    
    var params = {
        TableName : "alexacommute_sign_up",
        Key : {
            alxID : {
                'S' : req.userId
            }
        }
    }

    db.getItem(params, function(err, data) {
        if (err) {
            console.log("Error getting item from DB:" + err);
            var prompt = "We haven't met before. Please register your userID in the registration portal";
            res.say(prompt).shouldEndSession(false);
            res.send();
        }
        else {
            console.log("Found userID in DB: "+ JSON.stringify(data));
            var prompt = "Hello, I found your registration record. Is your address at: " + data.Item.alexaLocation.S + ".";
            res.say(prompt).shouldEndSession(false);
            res.send();
        }
    });

    return false;
};