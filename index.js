var app = require("express")();
var bodyParser = require("body-parser");
var request = require("request");
var async = require("async");

app.set("port", (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post("/callback", function(req, res){
	async.waterfall([function(callback) {
		var json = req["body"]["result"][0]["content"];
		var type = json.contentType;
		if(type === 1){
			var text = json.text;
			var result = "OK" + text;

			callback(null, json.from, result);
		}
	}], function(err, from, result) {		// LINE BOT
		if(err) return;
		var headers = {
			"Content-Type" : "application/json; charset=UTF-8",
			"X-Line-ChannelID" : process.env.ChannelID,
			"X-Line-ChannelSecret" : process.env.ChannelSecret,
			"X-Line-Trusted-User-With-ACL" : process.env.MID
		};
		var data = {
			"to": [from],
			"toChannel": 1383378250,
			"eventType":"138311608800106203",
			"content": {
				"contentType":1,
				"toType":1,
				"text": result
			}
		};
		var options = {
			url: "https://trialbot-api.line.me/v1/events",
			proxy : process.env.FIXIE_URL,
			headers: headers,
			json: true,
			body: data
		};
		request.post(options, function (err, res, body) {
			if (!err && res.statusCode == 200) {
				console.log(JSON.stringify(body));
			} else {
				console.log("error: "+ JSON.stringify(res));
			}
		});
	});
});

app.listen(app.get("port"), function() {
	console.log("Node app is running");
});



// var a = {
// 	"statusCode":500,
// 	"body":{
// 		"statusCode":"500",
// 		"statusMessage":"unexpected error found at call bot api sendMessage"
// 	},
// 	"headers":{
// 		"server":"nginx",
// 		"date":"Sat, 20 Aug 2016 07:10:43 GMT",
// 		"content-type":"application/json;charset=ISO-8859-1",
// 		"content-length":"89",
// 		"connection":"close",
// 		"cache-control":"private, max-age=180",
// 		"content-language":"en-US"
// 	},
// 	"request":{
// 		"uri":{
// 			"protocol":"https:",
// 			"slashes":true,
// 			"auth":null,
// 			"host":"trialbot-api.line.me",
// 			"port":443,
// 			"hostname":"trialbot-api.line.me",
// 			"hash":null,
// 			"search":null,
// 			"query":null,
// 			"pathname":"/v1/events",
// 			"path":"/v1/events",
// 			"href":"https://trialbot-api.line.me/v1/events"
// 		},
// 		"method":"POST",
// 		"headers":{
// 			"Content-Type":"application/json; charset=UTF-8",
// 			"X-Line-ChannelID":"1476491138",
// 			"X-Line-ChannelSecret":"ea01356125d53547178805e2034852b2",
// 			"X-Line-Trusted-User-With-ACL":"u3b155cc22d0fb11a44f9f79654c04a6f",
// 			"accept":"application/json",
// 			"content-length":163
// 		}
// 	}
// };