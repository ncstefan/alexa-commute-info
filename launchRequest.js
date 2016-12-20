'use strict';

//LaunchRequest handler
exports.launchRequestHandler = function(req,res) {

console.log("LaunchRequest()");

    res.session("previousState", "acquaintance")
    var prompt = "Hello there! Have we met before?";
    res.say(prompt).reprompt(prompt).shouldEndSession(false);
};