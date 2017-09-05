// thaw-tic-tac-toe-web-app/src/app.js

'use strict';

// require('rootpath')();
const express = require('express');
const path = require('path');

const httpJsonRequest = require('thaw-http-json-request');

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
//	res.header("Access-Control-Allow-Origin", "null");
//	res.header("GET");
//	next();
// });

// **** Cross-Origin Resource Sharing: End ****

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', function (req, res) {
	console.log('GET / : Sending the file index.html');
	res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/tictactoe/:board([EXO]{9})/:maxPly([0-9]{1})', function (req, res) {
	const boardString = req.params.board;
	const maxPly = req.params.maxPly;
	const descriptor = {
		noHttps: true,
		headers: { accept: 'application/json; charset=utf-8' },
		host: 'localhost',
		port: 3000,
		path: '/tictactoe/' + boardString + '/' + maxPly
	};

	httpJsonRequest
		.get(descriptor)
		.then(jsonResult => {
			// console.log('httpJsonRequest.get() succeeded! Returned JSON data is:\n\n', jsonResult, '\n');
			res.json(jsonResult);
		})
		.fail(error => {
			console.error('httpJsonRequest.get() returned an error:\n\n', error, '\n');
			// console.error('error.statusCode:', error.statusCode);
			// console.error('error.statusMessage:', error.statusMessage);

			const errorMessage = 'Error during httpJsonRequest: ' + error.message;

			console.error(errorMessage);
			res.status(500).send(errorMessage);
		})
		.done();
});

// app.get('/jquery.min.js', function (req, res) {
//	res.redirect('https://code.jquery.com/jquery-3.2.1.min.js');
//	res.sendFile(path.join(__dirname, 'node_modules', 'jquery', 'dist', 'jquery.min.js'));
// });

// GET http://localhost:3001/script.js [HTTP/1.1 404 Not Found 1ms]
// The resource from “http://localhost:3001/script.js” was blocked due to MIME type mismatch (X-Content-Type-Options: nosniff).[Learn More]

app.get('/script.js', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'script.js'));
});

module.exports = app;
