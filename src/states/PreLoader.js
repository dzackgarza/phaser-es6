import RainbowText from 'objects/RainbowText';

/*
 * Sets up minimal game configuration to display loading screen.
 */
class PreLoader extends Phaser.State {

  preload() {

    let center = this.game.global.center;

    let preloadBar = this.add.sprite(center.x, center.y / 2, 'preloadbar');
    preloadBar.anchor.setTo(0.5);
    this.load.setPreloadSprite(preloadBar);

    let text = new RainbowText(this.game, center.x, center.y, "");
    text.anchor.set(0.5);

    this.game.load.onLoadStart.addOnce(() => {
      text.setText("Loading...");
    }, this);

    this.game.load.onFileComplete.add((progress, cacheKey, success, totalLoaded, totalFiles) => {
      text.setText(`Progress: ${progress}% \n${totalLoaded} / ${totalFiles}`);
    }, this);

    this.game.load.onLoadComplete.addOnce(() => {
      console.log("Loaded assets succesfully.");
      preloadBar.destroy();
      text.destroy();
      this.state.start("TitleScreen");
    }, this);

    this.loadAssets();

  }

  create() {}

  loadAssets() {

    this.game.load.spritesheet('button', 'assets/images/button_sprite_sheet.png', 193, 71, 3);

    // this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);

		this.game.load.tilemap(this.game.global.tilemapName, 'assets/tilemaps/data/mapmod.json',
			null, Phaser.Tilemap.TILED_JSON);

    this.game.load.image(this.game.global.tilesetName, 'assets/tilemaps/tilesets/tileset.png');

    this.load.image('gameTiles', 'assets/images/tiles.png');
    this.load.image('greencup', 'assets/images/greencup.png');
    this.load.image('bluecup', 'assets/images/bluecup.png');
    this.load.image('player', 'assets/images/player.png');
    this.load.image('browndoor', 'assets/images/browndoor.png');
    this.load.image('bigImage', 'assets/images/bigImage.png');
    this.load.image('bigImage2', 'assets/images/biggerImage.jpg');
  }


}

export default PreLoader;
