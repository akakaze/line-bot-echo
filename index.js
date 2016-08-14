/*
var http = require('http'),
    url = require("url"),
    fixieUrl = url.parse(process.env.FIXIE_URL),
    requestUrl = url.parse("http://www.example.com");
http.get({
    host: fixieUrl.hostname,
    port: fixieUrl.port,
    path: requestUrl.href,
    headers: {
        Host: requestUrl.host,
        "Proxy-Authorization": "Basic " + new Buffer(fixieUrl.auth).toString('base64'),
    }
}, function (res) {
    console.log("Got response: " + res.statusCode);
});
*/

var _ = require('lodash');
var bodyParser = require('body-parser');
var express = require('express');
var proxy = require('express-http-proxy');
var request = require('superagent');
var LineBot = require('line-bot-sdk');
var client = LineBot.client({
    channelID: process.env.ChannelID,
    channelSecret: process.env.ChannelSecret,
    channelMID: process.env.MID
});

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use('/', proxy(process.env.FIXIE_URL));
app.use(bodyParser.urlencoded({ extended: false, limit: 2 * 1024 * 1024 }));
app.use(bodyParser.json({ limit: 2 * 1024 * 1024 }));
app.get('/', function (req, res) {
    console.log(req);
    console.log("OK");
});

/*
app.post('/', function (req, res) {
    //console.log(req.body.result);

    var receives = client.createReceivesFromJSON(req.body);
    _.each(receives, function(receive){
        if(receive.isMessage()){
            if(receive.isText()){
                if(receive.getText()==='me'){
                    client
                    .getUserProfile(receive.getFromMid())
                    .then(function onResult(res){
                        if(res.status === 200){
                            var contacts = res.body.contacts;
                            if(contacts.length > 0){
                                client.sendText(receive.getFromMid(), 'Hi!, you\'re ' + contacts[0].displayName);
                            }
                        }
                    }, function onError(err){
                        console.error(err.response.res.text);
                    });
                } else {
                    client.sendText(receive.getFromMid(), receive.getText());
                }
            }else if(receive.isImage()){
                client.sendText(receive.getFromMid(), 'Thanks for the image!');
            }else if(receive.isVideo()){
                client.sendText(receive.getFromMid(), 'Thanks for the video!');
            }else if(receive.isAudio()){
                client.sendText(receive.getFromMid(), 'Thanks for the audio!');
            }else if(receive.isLocation()){
                client.sendLocation(
                    receive.getFromMid(),
                    receive.getText() + receive.getAddress(),
                    receive.getLatitude(),
                    receive.getLongitude()
                );
            }else if(receive.isSticker()){
                // This only works if the BOT account have the same sticker too
                client.sendSticker(
                    receive.getFromMid(),
                    receive.getStkId(),
                    receive.getStkPkgId(),
                    receive.getStkVer()
                );
            }else if(receive.isContact()){
                client.sendText(receive.getFromMid(), 'Thanks for the contact');
            }else{
                console.error('found unknown message type');
            }
        }else if(receive.isOperation()){
            console.log('found operation');
        }else {
            console.error('invalid receive type');
        }
    });
    res.send('ok');
});
*/

app.listen(app.get('port'), function () {
    console.log('Listening on port ' + app.get('port'));
});
