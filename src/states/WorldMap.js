import RainbowText from 'objects/RainbowText';
import Player from '../mobs/Player';
import NPC from '../mobs/NPC';
import Map from '../mobs/Map';


const sprites = [{
	cacheKey: 'player',
	path: 'assets/images/sprites/ff4-remake-chocobo.png'
}, {
	cacheKey: 'tonberry',
	path: 'assets/images/sprites/tonberry.png'
}];

class WorldMap extends Phaser.State {
	static projectToGame(x, y) {
		return [16 * x, 16 * y];
	}

	preload() {
		sprites.map(a => {
			this.game.load.spritesheet(
				a.cacheKey, a.path, 16, 16);
		});
	}

	create() {
		let center = this.game.global.center;

		let text = new RainbowText(this.game, center.x, 0.1 * center.y, '');
		text.anchor.set(0.5);
		text.setText('Welcome to the World');

		this.game.time.events.add(Phaser.Timer.SECOND * 2, () => {
			text.destroy();
		}, this);


		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.keyStates = {
			cursors: this.cursors,
			w: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
			a: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
			s: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
			d: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
			z: this.game.input.keyboard.addKey(Phaser.Keyboard.Z)
		};


		document.getElementsByTagName('canvas')[0].focus();

		this.game.map = new Map(this.game);
		this.player = new Player(this.game, 'player', 1, 1);
		this.tonberry = new NPC(this.game, 'tonberry', 7, 7);
		this.game.map.entities = [this.player, this.tonberry];

		this.keyStates.z.onDown.add(() => {
			this.player.changeSpeed();
		}, this);

		this.game.physics.arcade.enable(this.player.sprite);
		this.game.camera.follow(this.player.sprite);
		this.game.eurecaServer.spawnOtherPlayers(this.game.clientID);
	}

	update() {
		// this.game.map.update();
		this.game.map.entities.map(a => a.update(this.keyStates));
		for (let id in this.game.playerList) {
			this.game.playerList[id].update();
		}
		this.game.map.update();
		// this.game.map.drawSurroundingCollisions();
		// this.game.input.enabled = this.game.input.activePointer.withinGame;
	}
}

export default WorldMap;
