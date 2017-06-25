import io from 'socket.io-client';

const websocket = io("http://127.0.0.1:6122", {
	path: "/gameServer"
});

export default websocket;
