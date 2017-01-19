'use strict'

exports.loadUserInfo = function(db, userID, getUserInfoCallback) {

    console.log("loading user data for:" + userID);

    var params = {
        TableName : "alexacommute_sign_up",
        Key : {
            alxID : {
                'S' : userID
            }
        }
    }

    console.log("params:" + JSON.stringify(params));

    db.getItem(params, function(err, data) {
        if ((err == undefined || err == null) && data.Item == undefined) {
            console.log("error in loading user information");
            getUserInfoCallback(false, data);
        }
        else if(data == null){
            console.log("user not found: " + err);
            getUserInfoCallback(false, data);
        }
        else {            
            console.log("success in loading user information");
            console.log(data);
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

