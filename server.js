"use strict"

var express = require('express');
var app = express(app);
var http = require('http');
var Eureca = require('eureca.io');

const CHAT_PORT = 6122,
	GAME_PORT = 6123;

app.get('/test', function (req, res) {
	res.send('Hello World!');
});

var chatServer = http.createServer(app);
module.exports.websocket = require('socket.io')(chatServer, {
	path: "/gameServer"
});
chatServer.listen(CHAT_PORT, function () {
	console.log(`Chat server running: ${CHAT_PORT}`);
});

const chatController = require('./server/chatController');
const gameController = require('./server/gameController');

var gameServer = http.createServer(app);

// Define which client-side functions the server is allowed to call.
var eurecaServer = new Eureca.Server({
	allow: ['setId', 'spawnRemotePlayer', 'kill', 'updateState']
});
eurecaServer.attach(gameServer);
eurecaServer.exports.hello = function (msg) {
	console.log(`Message from client: ${msg}`);
};


var clients = {};

eurecaServer.onConnect(function (conn) {
	console.log('New Client id=%s ', conn.id, conn.remoteAddress);
	var remote = eurecaServer.getClient(conn.id);
	clients[conn.id] = {
		id: conn.id,
		remote: remote,
		ip: conn.remoteAddress,
		x: 0,
		y: 0
	}
	remote.setId(conn.id);
});

eurecaServer.exports.registerPlayer = (id, x, y) => {
	const thisPlayer = clients[id];
	thisPlayer.x = x;
	thisPlayer.y = y;
};

eurecaServer.exports.spawnOtherPlayers = (id) => {
	for (var c in clients) {
		var remote = clients[c].remote;
		for (var cc in clients) {
			if (cc == id) continue;
			const x = clients[cc].x || 1;
			const y = clients[cc].y || 1;
			// clients[cc].ip.ip
			remote.spawnRemotePlayer(cc, x, y);
		}
	}
};

eurecaServer.exports.updateServerState = (id, tile) => {
	const player = clients[id];
	player.x = tile.x;
	player.y = tile.y;
	for (var c in clients) {
		if (c.id == id) continue;
		clients[c].remote.updateState(id, tile);
	}
};

eurecaServer.exports.handleKeys = function (keys) {
	var conn = this.connection;
	var updatedClient = clients[conn.id];

	for (var c in clients) {
		var remote = clients[c].remote;

		//console.log('updating '+ c +' with ' + keys);
		remote.updateState(updatedClient.id, keys);

		//keep last known state so we can send it to new connected clients
		clients[c].laststate = keys;
	}
};

eurecaServer.onDisconnect(function (conn) {
	console.log('Client disconnected ', conn.id);
	delete clients[conn.id];
	for (var c in clients) {
		clients[c].remote.kill(conn.id);
	}
});

gameServer.listen(GAME_PORT, () => {
	console.log(`Eureca server listening on ${GAME_PORT}.`)
});
