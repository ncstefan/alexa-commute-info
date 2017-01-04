'use strict';

//noIntent
exports.stopIntentHandler = function(req,res) {

console.log("stopIntent()");

    res.shouldEndSession(true); 
    return true;
};
