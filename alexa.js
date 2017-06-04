var https = require('https');

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
            failure();
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
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                success(chunk);
            });
        }


    }).on('error', function (e) {
        failure(e);
    });

};




exports.handler = (event, context) => {

    try {

        if (event.session.new) {
            // New Session
            console.log("## NEW SESSION");
        }

        switch (event.request.type) {

            case "LaunchRequest":
                // Launch Request
                console.log(`## LAUNCH REQUEST`);
                context.succeed(
                    generateResponse(
                        buildSpeechletResponse("Welcome to Analysis Application", true),
                        {}
                    )
                );
                break;

            case "IntentRequest":
                // Intent Request
                console.log(`## INTENT REQUEST ## ${event.request.intent.name}`);

                switch (event.request.intent.name) {
                    case "MyFriendsList":


                        httpClient.doGet(
                            {
                                host: 'alexa-websocket-integration.herokuapp.com',
                                path: '/'
                            }, function (data) {
                                // GET SUCCESS:
                                console.log('GET SUCCESS: ' + jsonData);

                                var jsonData = JSON.parse(data);
                                console.log(jsonData.msg);

                                context.succeed(
                                    generateResponse(
                                        buildSpeechletResponse(jsonData.msg, true),
                                        {}
                                    )
                                );

                            }, function (err) {
                                // GET FAILURE :
                                console.log('GET FAILURE: ' + err.message);

                            });


                        break;

                    case "ShowContextBrowser":

                        console.log('POST READY: ');


                        httpClient.doPost(
                            {
                                host: 'alexa-websocket-integration.herokuapp.com',
                                path: '/ws',
                                data: '{"msg": "show-context-browser"}'
                            }, function (data) {
                                // POST SUCCESS:
                                console.log('POST SUCCESS: ' + data);

                                context.succeed(
                                    generateResponse(
                                        buildSpeechletResponse(`Showing Context Browser`, true),
                                        {}
                                    )
                                );

                            },function (err) {
                                // POST FAILURE :
                                console.log('POST FAILURE: ' + err.message);

                                context.fail('Failed to show context browser');

                            });


                        break;


                    case "ShowTSData":

                        console.log(`## SinceDate ## ${event.request.intent.slots.SinceDate.value}`);

                        context.succeed(
                            generateResponse(
                                buildSpeechletResponse(`Showing ${event.request.intent.slots.SinceDate.value} Time Series Data`, true),
                                {}
                            )
                        );
                        break;

                    case "ThankYou":

                        context.succeed(
                            generateResponse(
                                buildSpeechletResponse(`Thanks for visiting Analysis Application`, true),
                                {}
                            )
                        );
                        break;


                    default:
                        throw "Invalid intent"
                }

                break;

            case "SessionEndedRequest":
                // Session Ended Request
                console.log(`SESSION ENDED REQUEST`);
                break;

            default:
                context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)

        }

    } catch (error) {
        context.fail(`Exception: ${error}`)
    }

};

// Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {

    return {
        outputSpeech: {
            type: "PlainText",
            text: outputText
        },
        shouldEndSession: shouldEndSession
    }

};

generateResponse = (speechletResponse, sessionAttributes) => {

    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }

};
