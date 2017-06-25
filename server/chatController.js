'use strict';

const globalSocket = require('../server')
	.websocket;
var db = require('diskdb');
db = db.connect('database/chat', ['chatlogs']);
const maxMsgHistory = 10;
let clients = [];


let processMessage = (msgPacket) => {
	console.log(`Message recvd: ${msgPacket.message}`)
	db.chatlogs.save(msgPacket);
	globalSocket.emit('chat message', msgPacket);
};

let processLogin = (socket) => {
	console.log(`A user has connected: ${socket.id}`);

	const messageQ = db.chatlogs.find()
		.slice(-maxMsgHistory, -1);

	console.log(messageQ.map(a => a.message));

	messageQ.map(a => socket.emit('chat message', a));

	socket.on('chat message', processMessage);
};

console.log("Initializing chat server..");
globalSocket.on('connection', processLogin);
console.log("Chat server running.");
