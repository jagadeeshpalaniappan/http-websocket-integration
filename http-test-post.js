var https = require('http');

var httpClient = {};

httpClient.doPost = function (input, success, failure) {


    var options = {
        host: input.host,
        path: input.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    var req = https.request(options, function (res) {

        // console.log('STATUS: ' + res.statusCode);
        // console.log('HEADERS: ' + JSON.stringify(res.headers));

        // Successfully POSTED:
        if (res.statusCode !== 200) {
            console.log("Status Code " + res.statusCode);
            failure({message: res.statusCode});
        } else {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {

                success(chunk);

            });
        }

    });

    req.on('error', function (e) {
        failure(e);
    });

    // write data to request body
    req.write(input.data);
    req.end();


};


httpClient.doPost(
    {
        host: 'alexa-websocket-integration.herokuapp.com',
        path: '/ws',
        data: '{"msg": "show-context-browser"}'
    }, function (data) {
        // POST SUCCESS:
        console.log('POST SUCCESS: ' + data);
    },function (err) {
        // POST FAILURE :
        console.log('POST FAILURE: ' + err.message);

    });

