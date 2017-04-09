'use strict';
var https = require('https');

function setMapAPIOptions(name) {

    var options = {
        host: 'maps.googleapis.com',
        port: 443,
        path: '',
        method: 'GET'
    };

    console.log("Setting Options URI");

    // Set route URI for <name> depending on transportation option
    var orig = app.dictionary.orig[0].replace(/ /g, "+");
    var dest = app.dictionary.dest[app.dictionary.names.indexOf(name)].replace(/ /g, "+");
    console.log(orig);
    console.log(dest);
    
    //if(opt == 'car')
        options.path = '/maps/api/distancematrix/json?origins=' + orig + '&destinations=' + dest + '&mode=driving&departure_time=now&key=AIzaSyCmZYBGNZw_Tkej-NwnCoEnzTwCy1lr4sg'
    // else
    //     options.path = '/maps/api/directions/json?origin=' + orig + '&destination=' + dest + '&mode=transit&key=AIzaSyCmZYBGNZw_Tkej-NwnCoEnzTwCy1lr4sg'    //@@@ no mstter what it's by bus

    return options;
}

//builds the string listing the configured route names
exports.getNameList = function (){
    try{
        //user record not found                
        //build the list of all names
        var namelist = '';
        var idx = 0;
        if (app.dictionary.names.length == 1) {
            //single name/destination
            namelist = namelist + app.dictionary.names[0];
        }
        else {
            //multiple names/destinations
            for(var i=0, len = app.dictionary.names.length; i < len; i++){
                if (i == len - 1) 
                    namelist += " and " + app.dictionary.names[i];
                else if (i == 0) 
                    namelist += app.dictionary.names[i];
                else 
                    namelist += ", " + app.dictionary.names[i];
            }
        }
        //list registered names
        console.log("List of destination routes: " + namelist);
        //prompt for name again
        return namelist;
    }
    catch(err){
        //error building list of names
        console.log("error building the name list");
        return namelist;
    }

}

//retrieves traffic information from GoogleMaps for a given route in app.dictionary
function getLiveTraffic(name, getTrafficCallback) {

    console.log("getLiveTraffic()");

    // Get route information
    var req = https.request(setMapAPIOptions(name), function(res) {
        var str = '';

        res.on('data', function(chunk) {
            str += chunk;
        });

        res.on('end', function() {
            var file = JSON.parse(str);
            //if(opt == 'car')
                var duration = file.rows[0].elements[0].duration_in_traffic.value;
            // else    
            //     var duration = file.routes[0].legs[0].duration.value;

            //pass duration back to caller through the callback function
            getTrafficCallback(null, duration);
        });

        res.on('error', function(err) {
            console.log("error getting live traffic: " + err);
            //pass the error to the callback function
            getTrafficCallback(err,null);
        });

    });

  req.end();
}

//verifies the route and retrieves the traffic information
exports.getLiveTrafficForRoute = function( req, routeName, res ){
        var crtName = routeName.toLowerCase();
        console.log("getLiveTrafficForRoute() for: " + routeName + ".");
        console.log("Registered names: " + app.dictionary);

        //ask again if name not found in the list
        if (app.dictionary.names.indexOf(crtName) == -1) {
            //state change
            res.session("previousState", "nameNotFound");
            //ask again prompt
            var nameList = this.getNameList();
            if(!nameList){
                //err reading name list - END session
                var prompt = "Sorry, I have difficulties retrieving the list of registered routes. Please try again later.";
                res.say(prompt).shouldEndSession(true).send();
            }
            else{
                //ask for a name in the list
                var prompt = "I'm sorry I couldn't find a route for your name. Please choose a name you registered a destination route for. You added routes for: " + nameList + ". For whom would you like to know the commute time? Say, my name is:" ;
                res.say(prompt).shouldEndSession(false).send();
            }
            //return true so alexa-app sends the response right away.
            return true;
        }
        else {
            //state change
            res.session("previousState", "correctName");
            //retrieve commute duration for <name>
            console.log("User found: getting live traffic info");
            getLiveTraffic(crtName, function(err, duration) {
                if(err){
                    res.say( "I'm sorry "+ routeName + ". I have difficulties retrieving the commute time for your route. Please make sure you registered a valid address for your Alexa device location and your commute destinations.");
                    res.shouldEndSession(true).send();
                }
                res.say( routeName + ", your commute by car is: " + String(Math.round(duration/60)) + " minutes.");
                res.shouldEndSession(true).send();
            });
            //return false immediately so alexa-app doesn't send the response
            //and waits for the async call above to return the response
            return false;
        }
}
