// import WorldMap from '../states/WorldMap';
import SpriteConstants from './Constants';
import Mob from './Mob';
import $ from 'jquery';
import {
	login
} from '../frontend/Server';

class Player extends Mob {
	constructor(game, spriteCacheKey, x, y) {
		super(game, spriteCacheKey, x, y);

		this.walkingSpeed = SpriteConstants.WalkingSpeed.SLOWEST;

		this.addBasicAnimation();

		login('Guest has logged in.');
		this.game.eurecaServer.registerPlayer(this.game.clientID, x, y);

		this.$location = $('#displayLocation');
		this.$target = $('#displayTarget');
	}

	changeSpeed() {
		console.log('Changing speed');
		this.walkingSpeed == SpriteConstants.WalkingSpeed.NORMAL ?
			this.walkingSpeed = SpriteConstants.WalkingSpeed.RUN :
			this.walkingSpeed = SpriteConstants.WalkingSpeed.NORMAL;

		console.log(`Speed: ${this.walkingSpeed}`);
	}

	updateDirections(keyStates) {
		const surroundingCollisions = this.surroundingCollisions;

		if (keyStates.cursors.up.isDown) {
			this.walkingDirection = SpriteConstants.Direction.UP;
			this.isWalkingAnim = this.isMoving = !surroundingCollisions.up;
		} else if (keyStates.cursors.right.isDown) {
			this.walkingDirection = SpriteConstants.Direction.RIGHT;
			this.isWalkingAnim = this.isMoving = !surroundingCollisions.right;
		} else if (keyStates.cursors.down.isDown) {
			this.walkingDirection = SpriteConstants.Direction.DOWN;
			this.isWalkingAnim = this.isMoving = !surroundingCollisions.down;
		} else if (keyStates.cursors.left.isDown) {
			this.walkingDirection = SpriteConstants.Direction.LEFT;
			this.isWalkingAnim = this.isMoving = !surroundingCollisions.left;
		} else {
			this.isWalkingAnim = this.isMoving = false;
		}

		// this.needsUpdate = this.isMoving;
	}

	moveNPC(keyStates) {
		const tonberry = this.game.map.entities[1];
		// if (tonberry.isMoving) return;
		let oldX = tonberry.currentTile.x;
		let oldY = tonberry.currentTile.y;
		let newX = oldX;
		let newY = oldY;
		let direction;
		if (keyStates.w.isDown) {
			direction = 'up';
			newY = newY - 1;
		} else if (keyStates.a.isDown) {
			direction = 'left';
			newX = newX - 1;
		} else if (keyStates.s.isDown) {
			direction = 'down';
			newY = newY + 1;
		} else if (keyStates.d.isDown) {
			direction = 'right';
			newX = newX + 1;
		}


		// console.log(`Moving NPC ${direction}; (${oldX}, ${oldY}) -> (${newX}, ${newY}).`);
		tonberry.moveTo(newX, newY);
		return true;
	}

	updateStatsDisplay() {
		this.$location.html(`(${this.currentTile.x}, ${this.currentTile.y})`);
		this.$target.html(`(${this.nextTile.x}, ${this.nextTile.y})`);
	}


	update(keyStates) {
		const g = this.game;

		const keyDown = (keyStates.cursors.up.isDown ||
			keyStates.cursors.left.isDown ||
			keyStates.cursors.down.isDown ||
			keyStates.cursors.right.isDown);

		if (keyDown) {
			this.needsUpdate = true;
		}

		const npcKeyDown = (keyStates.w.isDown ||
			keyStates.a.isDown ||
			keyStates.s.isDown ||
			keyStates.d.isDown);

		if (keyStates.z.isDown) {
			debugger;
		}
		if (npcKeyDown) {
			return this.moveNPC(keyStates);
		}

		super.doMovement(() => {
			this.updateStatsDisplay();
		}, () => {
			this.updateDirections(keyStates);
			this.updateStatsDisplay();
			// g.eurecaServer.updateServerState(this.game.clientID, this.currentTile);
		});

		super.update();
	}
}

export default Player;
