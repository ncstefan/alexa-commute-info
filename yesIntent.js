'use strict';

//yesIntent
exports.yesIntentHandler = function(req,res) {

console.log("yesIntent()");

    if(!req.session("previousState")) {
        res.shouldEndSession(false);
        return true;
    }

    return true;
};
