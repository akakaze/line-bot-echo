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
var proxy = require('express-http-proxy')(process.env.FIXIE_URL);
var LineBot = require('line-bot-sdk');
var client = LineBot.client({
	channelID: process.env.ChannelID,
	channelSecret: process.env.ChannelSecret,
	channelMID: process.env.MID
});

var app = require('express')();

app.set('port', (process.env.PORT || 5000));

//app.use('/', proxy);
app.use(bodyParser.json());

app.post('/', function (req, res) {
	console.log(req);
	console.log(res);
	/*
	var receives = client.createReceivesFromJSON(req.body);
	_.each(receives, function(receive){
		var mid = receive.getFromMid();
		if(receive.isMessage()){
			if(receive.isText()){
				if(receive.getText() === 'me'){
					client.getUserProfile(mid)
					.then(function(res){
						if(res.status === 200){
							var contacts = res.body.contacts;
							if(contacts.length > 0){
								client.sendText(mid, 'Hi!, you\'re ' + contacts[0].displayName);
							}
						}
					}, function(err){
						console.error(err.response.res.text);
					});
				} else {
					client.sendText(mid, receive.getText());
				}
			}else if(receive.isImage()){
				client.sendText(mid, 'Thanks for the image!');
			}else if(receive.isVideo()){
				client.sendText(mid, 'Thanks for the video!');
			}else if(receive.isAudio()){
				client.sendText(mid, 'Thanks for the audio!');
			}else if(receive.isLocation()){
				client.sendLocation(mid, receive.getText() + receive.getAddress(), receive.getLatitude(), receive.getLongitude());
			}else if(receive.isSticker()){
				// This only works if the BOT account have the same sticker too
				client.sendSticker(mid, receive.getStkId(), receive.getStkPkgId(), receive.getStkVer());
			}else if(receive.isContact()){
				client.sendText(mid, 'Thanks for the contact');
			}else{
				console.error('found unknown message type');
			}
		}else if(receive.isOperation()){
			console.log('found operation');
		}else {
			console.error('invalid receive type');
		}
	});
	*/
	res.send('ok');
});

app.listen(app.get('port'), function () {
	console.log('Listening on port ' + app.get('port'));
});
