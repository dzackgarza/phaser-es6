'use strict';

var db = require('diskdb');
db = db.connect('database/game', ['chatlogs']);

const websocket = require('../server')
	.websocket;

let
	login = (msg) => {
		console.log(`Login message: ${msg}`);
	},

	movePlayer = (tileObject) => {
		websocket.emit('movePlayer', tileObject);
	}

let registerHandlers = (sio) => {

	sio.on('login', login);

	sio.on('movePlayer', movePlayer);

};

websocket.on('connection', registerHandlers)
