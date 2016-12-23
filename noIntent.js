'use strict';

//noIntent
exports.noIntentHandler = function(req,res) {

console.log("noIntent()");

    if(!req.session("previousState")) {
        res.shouldEndSession(false);
        return true;
    }

    return true;
};
