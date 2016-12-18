'use strict';
var https = require('https');
//var maps = require('maps');

function setMapAPIOptions(name, opt){

    var options = {
        host: 'maps.googleapis.com',
        port: 443,
        path: '',
        method: 'GET'
    };

console.log("Setting Options URI");

    // Set route URI for <name> depending on transportation option
    var orig = app.dictionary.orig[app.dictionary.names.indexOf(name)];
    var dest = app.dictionary.dest[app.dictionary.names.indexOf(name)];
    if(opt == 'car')
        options.path = '/maps/api/distancematrix/json?origins=' + orig + '&destinations=' + dest + '&mode=driving&departure_time=now&key=AIzaSyCmZYBGNZw_Tkej-NwnCoEnzTwCy1lr4sg'
    else
        options.path = '/maps/api/directions/json?origin=' + orig + '&destination=' + dest + '&mode=transit&key=AIzaSyCmZYBGNZw_Tkej-NwnCoEnzTwCy1lr4sg'

    return options;
}

exports.getLiveTraffic = function(name, opt, getTrafficCallback){

console.log("getLiveTraffic()");

    // Get route information
    var req = https.request(setMapAPIOptions(name, opt), function(res){
        var str = '';

        res.on('data', function (chunk) {
            str += chunk;
        });

        res.on('end', function () {
            var file = JSON.parse(str);
            if(opt == 'car')
                var duration = file.rows[0].elements[0].duration_in_traffic.value;
            else    
                var duration = file.routes[0].legs[0].duration.value;
            //pass duration back to caller through the callback function
            getTrafficCallback(duration);
        });

        res.on('error', function(err){
            console.log("Error getting live traffic:" + err);
        });

    });

  req.end();
}
