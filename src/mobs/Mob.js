import SpriteConstants from './Constants';

class Mob {
	constructor(game, spriteCacheKey, x, y) {
		this.game = game;
		this.map = game.map;

		this.isWalkingAnim = false;
		this.isMoving = false;

		this.animSpeed = SpriteConstants.AnimFPS.NORMAL;
		this.walkingDirection = SpriteConstants.Direction.DOWN;
		this.walkingSpeed = SpriteConstants.WalkingSpeed.RUN;

		this.sprite = game.add.sprite(
			this.getTileX(x),
			this.getTileY(y),
			spriteCacheKey
		);

		this.sprite.anchor.setTo(
			SpriteConstants.Anchor.X,
			SpriteConstants.Anchor.Y
		);

		this.oldTile = this.currentTile = {
			x: x,
			y: y
		};

		this.nextTile = this.currentTile;

		this.collidableTiles = [this.currentTile];

		this.partySize = 4;
		this.previousTiles = Array(this.partySize)
			.fill(this.currentTile);

		this.needsUpdate = false;
		this.blueTiles = this.previousTiles;
		this.redTiles = this.currentTile;
	}

	tilesAreEqual(t1, t2) {
		return t1.x == t2.x && t1.y == t2.y;
	}

	addBasicAnimation() {
		this.sprite.animations.add(SpriteConstants.Animation.STILL_DOWN, [0]);
		this.sprite.animations.add(SpriteConstants.Animation.STILL_UP, [2]);
		this.sprite.animations.add(SpriteConstants.Animation.STILL_SIDE, [4]);
		this.sprite.animations.add(SpriteConstants.Animation.WALKING_DOWN, [0, 1], this.animSpeed, true);
		this.sprite.animations.add(SpriteConstants.Animation.WALKING_UP, [2, 3], this.animSpeed, true);
		this.sprite.animations.add(SpriteConstants.Animation.WALKING_SIDE, [4, 5], this.animSpeed, true);
	}

	setAnim() {
		switch (this.walkingDirection) {
		case SpriteConstants.Direction.UP:
			this.sprite.animations.play(
				this.isWalkingAnim ?
					SpriteConstants.Animation.WALKING_UP :
					SpriteConstants.Animation.STILL_UP
			);
			break;

		case SpriteConstants.Direction.RIGHT:
			this.sprite.scale.x = -1;
			this.sprite.animations.play(
				this.isWalkingAnim ?
					SpriteConstants.Animation.WALKING_SIDE :
					SpriteConstants.Animation.STILL_SIDE
			);
			break;

		case SpriteConstants.Direction.DOWN:
			this.sprite.animations.play(
				this.isWalkingAnim ?
					SpriteConstants.Animation.WALKING_DOWN :
					SpriteConstants.Animation.STILL_DOWN
			);
			break;

		case SpriteConstants.Direction.LEFT:
			this.sprite.scale.x = 1;
			this.sprite.animations.play(
				this.isWalkingAnim ?
					SpriteConstants.Animation.WALKING_SIDE :
					SpriteConstants.Animation.STILL_SIDE
			);
			break;
		}

		if (!this.isWalkingAnim) {
			this.sprite.animations.stop();
		}
	}

	move() {
		if (this.isMoving) {
			switch (this.walkingDirection) {
			case SpriteConstants.Direction.UP:
				this.sprite.y -= this.walkingSpeed;
				break;

			case SpriteConstants.Direction.RIGHT:
				this.sprite.x += this.walkingSpeed;
				break;

			case SpriteConstants.Direction.DOWN:
				this.sprite.y += this.walkingSpeed;
				break;

			case SpriteConstants.Direction.LEFT:
				this.sprite.x -= this.walkingSpeed;
				break;
			}
		}
	}

	isWithinTile() {
		const spriteX = this.sprite.x + (SpriteConstants.Anchor.X * SpriteConstants.SIZE);
		const spriteY = this.sprite.y;
		return (spriteX % SpriteConstants.SIZE === 0) &&
			(spriteY % SpriteConstants.SIZE === 0);
	}

	betweenTiles() {
		return !(this.isWithinTile());
	}

	getTileFromCurrentPosition() {
		const spriteX = this.sprite.x - (SpriteConstants.Anchor.X * SpriteConstants.SIZE);
		const spriteY = this.sprite.y - SpriteConstants.SIZE;
		return {
			x: spriteX / SpriteConstants.SIZE,
			y: spriteY / SpriteConstants.SIZE
		};
	}

	getNextTile() {
		let nextTile;
		switch (this.walkingDirection) {
		case SpriteConstants.Direction.UP:
			nextTile = {
				x: this.currentTile.x,
				y: this.currentTile.y - 1
			};
			break;

		case SpriteConstants.Direction.RIGHT:
			nextTile = {
				x: this.currentTile.x + 1,
				y: this.currentTile.y
			};
			break;

		case SpriteConstants.Direction.DOWN:
			nextTile = {
				x: this.currentTile.x,
				y: this.currentTile.y + 1
			};
			break;

		case SpriteConstants.Direction.LEFT:
			nextTile = {
				x: this.currentTile.x - 1,
				y: this.currentTile.y
			};
			break;
		}
		return nextTile;
	}

	getTileX(tileXId) {
		return (SpriteConstants.Anchor.X * SpriteConstants.SIZE) + (tileXId * SpriteConstants.SIZE);
	}

	getTileY(tileYId) {
		return (SpriteConstants.Anchor.Y * SpriteConstants.SIZE) + (tileYId * SpriteConstants.SIZE);
	}

	updateCurrentTile(tile) {
		this.game.map.setIsSolid(this.currentTile, false);
		this.currentTile = this.getTileFromCurrentPosition();
		this.game.map.setIsSolid(this.currentTile, true);
	}

	findSurroundingCollisions() {
		this.surroundingCollisions = this.game.map
			.getSurroundingCollisionsAt(this.currentTile);
	}

	updateFollowerTiles() {
		const g = this.game;
		this.previousTiles.map(t => this.game.map.setIsSolid(t, false));
		if (!g.map.tilesAreEqual(this.currentTile, this.previousTiles.slice(-1)[0])) {
			this.previousTiles.push(this.currentTile);
			if (this.previousTiles.length > this.partySize) {
				this.previousTiles.shift();
			}
		}
	}

	doMovement(betweenTilesCallback, withinTilesCallback) {
		const g = this.game;

		if (this.betweenTiles()) {
			this.nextTile = this.getNextTile();
			g.map.setIsSolid(this.nextTile, true);
			this.previousTiles.map(t => g.map.setIsSolid(t, false));
			this.blueTiles = this.previousTiles;
			if (betweenTilesCallback) {
				betweenTilesCallback();
			}
			this.needsUpdate = true;
		} else if (this.needsUpdate) {
			this.updateCurrentTile();
			this.findSurroundingCollisions();
			this.updateFollowerTiles();
			this.needsUpdate = false;
			if (withinTilesCallback) {
				withinTilesCallback();
			}
		}
	}

	update() {
		this.setAnim();
		this.move();
	}
}

export default Mob;
