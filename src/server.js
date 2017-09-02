// node-js-express-template/server.js

// An example of a simple Express.js Web server.
// Tom Weatherhead - August 1, 2017

'use strict';

// require('rootpath')();
const app = require('./app');

const config = require('../config/config');			// I.e. ./config.json

const serverListenPort = config.serverListenPort || 3000;

// Start the server:

var server = app.listen(serverListenPort, function () {
	let host = server.address().address;

	if (host === '::') {
		host = 'localhost';
	}

	console.log('The Express.js server is listening at http://%s:%s (protocol %s)', host, server.address().port, server.address().family);
});

// End of File.
