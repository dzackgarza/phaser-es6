import $ from "jquery";
window.jQuery = window.$ = $;

require('bootstrap');

import * as paneHandler from 'frontend/ContentPane';
import * as chatHandler from 'frontend/ChatHandler';

import {
	serverInit
} from 'frontend/Server';

import Boot from 'states/Boot';
import PreLoader from 'states/PreLoader';
import TitleScreen from 'states/TitleScreen';
import WorldMap from 'states/WorldMap';



class Game extends Phaser.Game {

	constructor() {
		super(16 * 16, 16 * 16, Phaser.AUTO, 'content', null);

		this.MultiplayerServerReady = false;
		this.playerList = {};
		this.MyMyltiplayerId = 0;

		this.state.add('Boot', Boot, false);
		this.state.add('PreLoader', PreLoader, false);
		this.state.add('TitleScreen', TitleScreen, false);
		this.state.add('WorldMap', WorldMap, false);

		this.state.start('Boot');

	}

}

window.game = new Game();
serverInit(window.game);

paneHandler.init();
chatHandler.init();
