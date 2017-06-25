import websocket from './WebSocket';
import NPC from '../mobs/NPC';

export function login(msg) {
	console.log(msg);
	websocket.emit('login', msg);
}

export function movePlayer(tile) {
	websocket.emit('movePlayer', tile);
}

export function serverInit(gameReference) {
	console.log("Preparing Eureca client code");

	let game = gameReference;

	const eurecaClient = new Eureca.Client({
		uri: 'ws://localhost:6123/'
	});

	eurecaClient.ready(serverProxy => {
		serverProxy.hello('Eureca connected.');
		game.eurecaServer = serverProxy;
	});

	eurecaClient.exports.setId = id => {
		console.log(`Client| Setting ID: ${id}`);
		game.clientID = id;
		game.MultiplayerServerReady = true;

		$('#displayClientID')
			.html(id);
	};

	eurecaClient.exports.spawnRemotePlayer = (id, x, y) => {
		if (id == game.clientID) return;
		game.playerList[id] = new NPC(game, 'tonberry', x, y);
	};

	eurecaClient.exports.kill = id => {
		if (game.playerList[id]) {
			game.playerList[id].kill();
			console.log('killing ', id, game.playerList[id]);
		}
	};

	eurecaClient.exports.updateState = (id, tile) => {

		console.log(`Update: Player ${id}, Tile: (${tile.x}, ${tile.y})`);

		if (id == game.clientID) return;

		game.playerList[id].moveTo(tile);

		// if (game.playerList[id] && game.MyMyltiplayerId !== id) {
		//
		// 	//game.playerList[id].cursor = state;
		// 	game.playerList[id].setX(state.x);
		// 	game.playerList[id].setY(state.y);
		//
		// 	if (state.animationPlaying) {
		// 		game.playerList[id].playAnimation(state.animationPlaying);
		// 	} else {
		// 		game.playerList[id].stopAnimations();
		// 	}
		//
		// 	if (game.playerList[id].playerColor !== state.playerColor) {
		// 		game.playerList[id].setColor(state.playerColor);
		// 	}
		//
		// 	if (game.playerList[id].name !== state.playerName) {
		// 		game.playerList[id].setName(state.playerName);
		// 	}
		// }

	};
	console.log("All Eureca exports completed.");

}
