// import RainbowText from 'objects/RainbowText';

/*
 * Sets up minimal game configuration to display loading screen.
 */
class Boot extends Phaser.State {

	preload() {
		this.load.image('preloadbar', 'assets/images/preloader-bar.png');
	}

	create() {

    this.game.stage.backgroundColor = '#000000';

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.game.global = {
			center: {
				x: this.game.world.centerX,
				y: this.game.world.centerY
			},
			tilemapName: "worldmap",
			tilesetName: "worldtiles"
		}

		console.log("Game setup, starting preloader...")

		this.state.start("PreLoader")
	}

}

export default Boot;
