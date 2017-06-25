import dateFormat from 'dateformat';
import websocket from './WebSocket';

const messages = document.getElementById('messages');
const msgScrollContainer = document.getElementById('message-container');

const submitChat = function (e) {
	if (e.which == 13 && !e.shiftKey) {
		const tc = document.getElementById('textContent');
		const msg = tc.value;
		if (tc.value == '') return;
		tc.value = '';
		console.log(`Chat message: ${msg}`)
		websocket.emit('chat message', {
			time: Date.now(),
			message: msg
		});
	}
};

websocket.on('chat message', function (msgPacket) {
	const newDiv = document.createElement('div');
	newDiv.className = "message";
	newDiv.innerHTML =
		`
		<span class="time">[${dateFormat(msgPacket.time, "m/d, h:MM:ss TT")}]</span>
		<span class="from">Guest</span>
		<span class="text">${msgPacket.message}</span>`;

	messages.appendChild(newDiv);
	msgScrollContainer.scrollTop = msgScrollContainer.scrollHeight;
});

export function init() {
	document.getElementById('textContent')
		.onkeyup = submitChat;
	console.log(`Chat Handler started: ${dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT")}`);
}
