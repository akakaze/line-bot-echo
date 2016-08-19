var app = require("express")();
var bodyParser = require("body-parser");
var request = require("request");
var async = require("async");

app.set("port", (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post("/", function(req, res){
	async.waterfall([function(callback) {
		var json = req.body;
		var from = json["result"][0]["content"]["from"];
		var text = json["result"][0]["content"]["text"];
		var result = "OK" + text;

		callback(from, result);
	}], function(from, result) {		// LINE BOT
		var headers = {
			"Content-Type" : "application/json; charset=UTF-8",
			"X-Line-ChannelID" : process.env.ChannelID,
			"X-Line-ChannelSecret" : process.env.ChannelSecret,
			"X-Line-Trusted-User-With-ACL" : process.env.MID
		};
		console.log([from]);
		var data = {
			"to": [from],
			"toChannel": 1383378250,
			"eventType":"140177271400161403",
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
				console.log(body);
			} else {
				console.log("error: "+ JSON.stringify(res));
			}
		});
	});
});

app.listen(app.get("port"), function() {
	console.log("Node app is running");
});