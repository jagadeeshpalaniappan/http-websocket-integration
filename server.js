'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/', function (req, res) {
    res.send({ msg: "Jagadeesh' Web Socket Connection is Live" });
});


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Broadcast to all.
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {

            var respData = '{"msg":"'+data+'"}';

            console.log('2.msg sent to all ws clients : %s', respData);
            client.send(respData);
        }
    });
};


wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);
    // You might use location.query.access_token to authenticate or share sessions
    // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    ws.on('message', function incoming(message) {
        console.log('msg received from ws client: %s', message);
    });

    ws.send('{"msg":"connection-success"}');
});




app.post('/ws', function (req, res) {

    if (!req.body.msg || typeof req.body.msg != "string") {
        res.status(400).send("400 Bad Request")
    }

    console.log('1.msg received from alexa : %s', req.body.msg);

    wss.broadcast(req.body.msg);

    res.status(200).end();
});


server.listen(PORT, function listening() {
    console.log('Server is Listening on %d', server.address().port);
});