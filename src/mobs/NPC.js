import SpriteConstants from './Constants';
import Mob from './Mob';

class NPC extends Mob {
	constructor(game, spriteCacheKey, x, y) {
		super(game, spriteCacheKey, x, y);

		this.isMoving = true;
		this.isWalkingAnim = true;
		this.animSpeed = SpriteConstants.AnimFPS.SLOWEST;
		this.walkingSpeed = SpriteConstants.WalkingSpeed.SLOW;

		this.addBasicAnimation();
	}

	update() {
		super.doMovement(() => {

		}, () => {
			this.reverseDirectionOnCollision();
		});
		// const betweenTiles = super.betweenTiles();

		// if (betweenTiles) {
		// 	this.nextTile = this.getNextTile();
		// 	this.game.map.setIsSolid(this.nextTile, true);
		// 	this.blueTiles = [this.currentTile];
		// } else {
		// 	this.game.map.setIsSolid(this.currentTile, false);
		// 	this.currentTile = this.getTileFromCurrentPosition();
		// 	this.game.map.setIsSolid(this.currentTile, true);
		//
		// 	this.surroundingCollisions = this.game.map.getSurroundingCollisionsAt(this.currentTile);
		//
		// 	// movement behavior
		//
		// 	// this.randomDirectionOnCollision();
		// 	// this.setRandomDirection();
		// 	// if (!super.tilesAreEqual(this.currentTile, this.nextTile)) {
		// 	// 	console.log("Current != next tile");
		// 	// 	this.isWalkingAnim = this.isMoving = true;
		// 	// } else {
		// 	// 	this.isWalkingAnim = this.isMoving = false;
		// 	// }
		// }

		super.update();
	}

	receiveMove(x, y) {
		console.log(`NPC recived moved: (${x}, ${y})`);
	}

	moveTo(x, y) {
		this.nextTile = {x: x, y: y};
		let oldX = this.currentTile.x;
		let oldY = this.currentTile.y;
		let newX = this.nextTile.x;
		let newY = this.nextTile.y;

		console.log(`NPC moving from (${x}, ${y}) to (${newX}, ${newY})`);

		if (newX > oldX) {
			console.log('Facing right');
			this.walkingDirection = SpriteConstants.Direction.RIGHT;
		} else if (newX < oldX) {
			console.log('Facing left');
			this.walkingDirection = SpriteConstants.Direction.LEFT;
		} else if (newY < oldY) {
			console.log('Facing up');
			this.walkingDirection = SpriteConstants.Direction.UP;
		} else if (newY > oldY) {
			console.log('Facing down');
			this.walkingDirection = SpriteConstants.Direction.DOWN;
		}
	}

	reverseDirectionOnCollision() {
		switch (this.walkingDirection) {
		case SpriteConstants.Direction.UP:
			if (this.surroundingCollisions.up) {
				this.walkingDirection = SpriteConstants.Direction.DOWN;
			}
			break;

		case SpriteConstants.Direction.RIGHT:
			if (this.surroundingCollisions.right) {
				this.walkingDirection = SpriteConstants.Direction.LEFT;
			}
			break;

		case SpriteConstants.Direction.DOWN:
			if (this.surroundingCollisions.down) {
				this.walkingDirection = SpriteConstants.Direction.UP;
			}
			break;

		case SpriteConstants.Direction.LEFT:
			if (this.surroundingCollisions.left) {
				this.walkingDirection = SpriteConstants.Direction.RIGHT;
			}
			break;
		}
	}

	randomDirectionOnCollision() {
		switch (this.walkingDirection) {
		case SpriteConstants.Direction.UP:
			if (this.surroundingCollisions.up) {
				this.setRandomDirection();
			}
			break;

		case SpriteConstants.Direction.RIGHT:
			if (this.surroundingCollisions.right) {
				this.setRandomDirection();
			}
			break;

		case SpriteConstants.Direction.DOWN:
			if (this.surroundingCollisions.down) {
				this.setRandomDirection();
			}
			break;

		case SpriteConstants.Direction.LEFT:
			if (this.surroundingCollisions.left) {
				this.setRandomDirection();
			}
			break;
		}
	}

	getAvailableDirections() {
		let availableDirections = [];

		if (!this.surroundingCollisions.up) {
			availableDirections.push(SpriteConstants.Direction.UP);
		}
		if (!this.surroundingCollisions.right) {
			availableDirections.push(SpriteConstants.Direction.RIGHT);
		}
		if (!this.surroundingCollisions.down) {
			availableDirections.push(SpriteConstants.Direction.DOWN);
		}
		if (!this.surroundingCollisions.left) {
			availableDirections.push(SpriteConstants.Direction.LEFT);
		}

		return availableDirections;
	}

	setRandomDirection() {
		const directions = this.getAvailableDirections();
		const random = Math.floor(Math.random() * directions.length);
		this.walkingDirection = directions[random];
	}
}

export default NPC;
