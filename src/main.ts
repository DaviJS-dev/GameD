import Phaser from "phaser";
import Game from './scenes/Game'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 400,
	physics: {
		default: 'matter',
		matter: {
			debug: true,
		}
	},
	scene: [Game]
}

export default new Phaser.Game(config)
