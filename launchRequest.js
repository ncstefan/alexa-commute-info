'use strict';

//LaunchRequest handler
exports.launchRequestHandler = function(req,res) {

console.log("LaunchRequest()");

    res.session("previousState", "acquaintance")

    res.card({
        type: "Simple",
        title: "Here is your userID", // this is not required for type Simple
        content: "Copy this:\n " + req.userId + "\nVisit the portal at the link below:\n<link>"
    });

    var prompt = "Hello there! Have we meet before?";
    res.say(prompt).reprompt(prompt).shouldEndSession(false);
};