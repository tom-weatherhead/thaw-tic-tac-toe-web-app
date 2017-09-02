// node-js-express-template/app.js

// An example of a simple Express.js Web server.
// Tom Weatherhead - August 1, 2017

'use strict';

// require('rootpath')();
const express = require('express');
const path = require('path');

const app = express();

// **** Cross-Origin Resource Sharing: Begin ****

// See https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
// See https://enable-cors.org/server_expressjs.html

// General:

// If we uncomment the block below, Mocha will complain that "the header contains invalid characters".

// app.use(function(req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	next();
// });

// Minimal:

// app.use(function(req, res, next) {
	// res.header("Access-Control-Allow-Origin", "null");
	// res.header("GET");
	// next();
// });

// **** Cross-Origin Resource Sharing: End ****

app.use(express.static(path.join(__dirname, '..', 'public')));

// **** Request Event Handlers: Begin ****

app.get('/', function (req, res) {
	console.log('GET / : Sending the file index.html');
	res.sendFile(path.join(__dirname, '..', 'index.html'));
});






const http = require('http');		// See https://nodejs.org/api/http.html
	
app.get('/foo/:board([EXO]{9})/:maxPly([0-9]{1})', function(req, res) {
	let boardString = req.params.board;
	let maxPly = req.params.maxPly;
	let web_service_request_options_object = {
		host: 'localhost',
		port: 3000,
		path: '/tictactoe/' + boardString + '/' + maxPly
	};

	var request = http.get(web_service_request_options_object, (response) => {
	// var request = http.json(web_service_request_options_object, (response) => {
		// console.log('The response from the Web service is:', response);

		const statusCode = response.statusCode;
		const statusMessage = response.statusMessage;
		const contentType = response.headers['content-type'];

		console.log('Response: Status code:', statusCode, statusMessage);
		// console.log('Response: Headers:', response.headers);
		console.log('Response: Content type:', contentType);

		let error;

		if (statusCode !== 200) {
			// error = new Error(`HTTP request to financial data service failed.\nHTTP status code: ${statusCode}`);
			error = new Error('HTTPS request to Web service failed.\nHTTPS status: ' + statusCode + ' ' + statusMessage);
		// } else if (!/^application\/json/.test(contentType)) {
			// Google Finance does not respond with application/json.
			// error = new Error(`Invalid content-type.\nExpected application/json but received ${contentType}`);
		}

		if (error) {
			var errorMessage = 'Error in https-json-request.service: ' + error.message;

			console.error(errorMessage);
			response.resume();				// Consume the response data to free up memory.
			// deferred.reject(errorMessage);
			res.status(500).send(errorMessage);
		}

		// console.log('The response from the Web service is:', response);
		// console.log('response.body:', response.body);
		// res.json(response.body);
		response.setEncoding('utf8');

		let rawData = '';

		response.on('data', (chunk) => { rawData += chunk; });

		response.on('end', () => {
			try {
				// console.log('The raw data from the Web service response is:', rawData);
				var jsonData = JSON.parse(rawData);
				// console.log('The JSON data parsed from the Web service response is:', parsedData);
				// deferred.resolve(jsonData);
				res.json(jsonData);
			} catch (error) {
				var errorMessage = 'Error in https-json-request.service while parsing the response as JSON: ' + error.message;

				console.error(errorMessage);
				// deferred.reject(errorMessage);
				res.status(500).send(errorMessage);
			}
		});
	}).on('error', (error) => {
		var errorMessage = 'Inside on(error) : Error in https-json-request.service: ' + error.message;

		// console.error(`Got error: ${error.message}`);
		console.error(error);
		console.error(errorMessage);
		deferred.reject(errorMessage);
	});
});








// app.get('/jquery.min.js', function (req, res) {
//	res.redirect('https://code.jquery.com/jquery-3.2.1.min.js');
//	res.sendFile(path.join(__dirname, 'node_modules', 'jquery', 'dist', 'jquery.min.js'));
// });

app.get('/script.js', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'script.js'));
});

app.get('/css/style.css', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'public', 'css', 'style.css'));
});

// **** Request Event Handlers: End ****

module.exports = app;

// End of File.
