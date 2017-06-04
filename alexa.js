exports.handler = (event, context) => {

    try {

        if (event.session.new) {
            // New Session
            console.log("## NEW SESSION")
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

                        context.succeed(
                            generateResponse(
                                buildSpeechletResponse(`Roopesh, Pradeep and Abhilash`, true),
                                {}
                            )
                        );

                        break;

                    case "ShowContextBrowser":

                        context.succeed(
                            generateResponse(
                                buildSpeechletResponse(`Showing Context Browser`, true),
                                {}
                            )
                        );
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
