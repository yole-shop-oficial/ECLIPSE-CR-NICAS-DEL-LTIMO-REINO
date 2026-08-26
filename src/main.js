import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import PrologueScene from './scenes/PrologueScene.js';
import CharacterSelectScene from './scenes/CharacterSelectScene.js';
import WorldScene from './scenes/WorldScene.js';
import CardCollectionScene from './scenes/CardCollectionScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: '#05070d',
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: [BootScene, MainMenuScene, PrologueScene, CharacterSelectScene, WorldScene, CardCollectionScene],
  render: {
    antialias: true,
    pixelArt: false,
  },
};

// eslint-disable-next-line no-new
new Phaser.Game(config);
