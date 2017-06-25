import SpriteConstants from './Constants';

class Map {
	constructor(game, entities) {
		this.game = game;
		this.surroundingsToDraw = [];
		this.tileMap = game.cache.getTilemapData(game.global.tilemapName);

		this.entities = entities;

		const tileData = this.tileMap.data;

		this.map = game.add.tilemap(game.global.tilemapName);
		this.map.addTilesetImage(tileData.tilesets[0].name, game.global.tilesetName);

		this.tileLayer = this.map.createLayer(tileData.layers[0].name);

		this.TILE_SIZE = this.map.tileHeight;
		this.NUM_COLUMNS = this.map.width;
		this.NUM_ROWS = this.map.height;

		// this.tileLayer.debug = true;

		this.allTiles = this.tileLayer.layer.data;

		this.inertTiles = this.allTiles
			.reduce((a, b) => a.concat(b), [])
			.filter(a => a.properties.solid);

		if (SpriteConstants.DEBUG) {
			this.inertTiles
				.map(tile => {
					this.drawRedRectAt(tile);
				});
		}

		this.tileLayer.resizeWorld();

		this.tilesToDraw = new Set();
		// Array.from(mySet).map(a => a.split(',').map(Number))[0]
	}

	update(tilesToColor) {
		if (SpriteConstants.DEBUG) {
			this.game.map.entities.map(a => {
				a.blueTiles.map(tile => {
					this.drawBlueRectAt(tile);
				});
			});

			this.allTiles
				.reduce((a, b) => a.concat(b), [])
				.filter(a => a.properties.solid)
				.map(tile => {
					this.drawRedRectAt(tile);
				});
		}
	}

	tilesAreEqual(t1, t2) {
		return t1.x === t2.x && t1.y === t2.y;
	}

	isInsideMap(tile) {
		return (tile.y >= 0 && tile.y < this.NUM_ROWS &&
			tile.x >= 0 && tile.x < this.NUM_COLUMNS);
	}

	isSolid(tile) {
		return (!this.isInsideMap(tile) ||
			this.tileLayer.layer.data[tile.y][tile.x].properties.solid);
	}

	setIsSolid(tile, solidity) {
		this.tileLayer.layer.data[tile.y][tile.x].properties.solid = solidity;
	}

	drawRectAt(tile, color) {
		if (!tile) {
			tile = {
				x: 0,
				y: 0
			};
		}
		let rect = new Phaser.Rectangle(
			tile.x * this.TILE_SIZE,
			tile.y * this.TILE_SIZE,
			this.TILE_SIZE, this.TILE_SIZE
		);
		this.game.debug.geom(rect, color, true);
	}

	drawRedRectAt(tile) {
		this.drawRectAt(tile, 'rgba(240, 0, 0, 0.333)');
	}

	drawGreenRectAt(tile) {
		this.drawRectAt(tile, 'rgba(0, 240, 0, 0.333)');
	}

	drawBlueRectAt(tile) {
		this.drawRectAt(tile, 'rgba(0, 0, 240, 0.333)');
	}

	// True if
	getSurroundingCollisionsAt(tile) {
		return {
			up: this.isSolid({
				x: tile.x,
				y: tile.y - 1
			}),
			right: this.isSolid({
				x: tile.x + 1,
				y: tile.y
			}),
			down: this.isSolid({
				x: tile.x,
				y: tile.y + 1
			}),
			left: this.isSolid({
				x: tile.x - 1,
				y: tile.y
			})
		};
	}
}

export default Map;
