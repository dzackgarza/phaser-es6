import RainbowText from 'objects/RainbowText';

const overState = 2,
	outState = 1,
	downState = 0;

const dev = true;

class TitleScreen extends Phaser.State {

	preload() {

	}

	create() {

		let center = this.game.global.center;

		this.text = new RainbowText(this.game, center.x, 0.2 * center.y, "");
		this.text.anchor.set(0.5);
		this.text.setText("Click to \nBegin Adventure");

		if (dev) {
			this.startGame();
		} else {
			this.button = this.game.add.button(center.x - (0.5 * 190), 1.2 * center.y, 'button', this.startGame, this, overState, outState, downState);
		}

	}

	startGame() {
		if (this.button) this.button.destroy();
		this.text.destroy();
		this.state.start("WorldMap");
	}

}

export default TitleScreen;
