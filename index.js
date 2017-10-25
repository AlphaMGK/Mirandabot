// const APIAI_TOKEN = process.env.APIAI_TOKEN;
// const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;
const APIAI_TOKEN = 'cf9e9603edaa40d5a52f361fe0b20cd2';
const APIAI_SESSION_ID = '12345';

const express = require('express');
const app = express();

	app.use(express.static(__dirname + '/views'));
	app.use(express.static(__dirname + '/public'));

	const server = app.listen(process.env.PORT || 5000, function(){
		console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
	});
	
	const apiai = require('apiai')(APIAI_TOKEN);
	const io = require('socket.io')(server);

	io.on('connection', function(socket){
		console.log('user connected');
	});

	app.get('/', function(req, res) {
		res.sendFile('index.html');
	});

	io.on('connection', function(socket){
		socket.on('voice message', function(text){
			console.log(text);
			
			let apiaiReq = apiai.textRequest(text, {
			sessionId: APIAI_SESSION_ID
			});

			apiaiReq.on('response', function(response) {
			let aiText = response.result.fulfillment.speech;
			socket.emit('bot reply', aiText); // Send the result back to the browser!
			});

			apiaiReq.on('error', function(error){
			console.log(error);
			});

			apiaiReq.end();
		});
	});
