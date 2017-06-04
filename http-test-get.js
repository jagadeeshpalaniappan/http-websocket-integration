var https = require('https');


var httpClient = {};

httpClient.doGet = function (input, success, failure) {

    var options = {
        host: input.host,
        path: input.path
    };

    https.get(options, function (res) {

        // Successfully POSTED:
        if (res.statusCode !== 200) {

            console.log("Status Code " + res.statusCode);
            failure({message: res.statusCode});

        } else {
            // res.setEncoding('utf8');
            res.on('data', function (chunk) {
                success(chunk);
            });
        }


    }).on('error', function (e) {
        failure(e);
    });

};


httpClient.doGet(
    {
        host: 'alexa-websocket-integration.herokuapp.com',
        path: '/'
    }, function (data) {
        // GET SUCCESS:
        console.log('GET SUCCESS: ' + data);
    }, function (err) {
        // GET FAILURE :
        console.log('GET FAILURE: ' + err.message);

    });

