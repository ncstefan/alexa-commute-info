'use strict'
var AWS = require('aws-sdk');

exports.loadUserInfo = function(db, getUserInfoCallback) {

    var params = {
        TableName : "alexacommute_sign_up",
        Key : {
            alxID : {
                'S' : "amzn1.ask.account.AEZZJ3JVFHBTCTX7OREACSPKWXHUL4OI4ST2KOV2PGXZAO6ZOJNT6L46CD7MXYVKTSHDQ7YT2HHWPM7MX4TU2ATEMR5CBQQWQ25ETTMOD2UQCEMOX3IYA7HEEFSRG5L3JJN4B46DS4WPF2RDH2XEFT7V7E6GARFAHJIII7RUY6NF62VPFKFZYS6XSH3EE37RLCM53J7UX4XYULA"
                //req.userId
            }
        }
    }

    db.getItem(params, function(err, data) {
        if ((err == undefined || err == null) && data.Item == undefined) {
            console.log("error in loading user information");
            getUserInfoCallback(false);
        }
        else {
            console.log("success in loading user information");
            //console.log(data);
            //console.log(data.Item.names.L[0]);
            
            //populate dictionary with names
            app.dictionary.names = [];
            for (var i = 0; i < data.Item.names.L.length; i++) {
                app.dictionary.names.push(data.Item.names.L[i].M.Name.S);
            }
            console.log(app.dictionary.names.indexOf(data.Item.names.L[1].M.Name.S));
            console.log(app.dictionary.names[1]);

            //populate dictionary with home address
            app.dictionary.orig = [];
            app.dictionary.orig.push(data.Item.alexaLocation.S);
            console.log(app.dictionary.orig.indexOf(data.Item.alexaLocation.S));
            console.log(app.dictionary.orig[0]);

            //populate dictionary with destination address
            app.dictionary.dest = [];
            for (var i = 0; i < data.Item.names.L.length; i++) {
                app.dictionary.dest.push(data.Item.names.L[i].M.Address.S);
            }
            console.log(app.dictionary.dest.indexOf(data.Item.names.L[1].M.Address.S));
            console.log(app.dictionary.dest[1]);

            //return success: true
            getUserInfoCallback(true, data);
        }
    });
}

