import Phaser from 'phaser';
import { ART } from '../data/assets.js';

// Escena mínima: solo carga el fondo de la pantalla de carga
// antes de mostrar cualquier interfaz, para evitar texturas rotas.
export default class PreloadBootScene extends Phaser.Scene {
  constructor() {
    super('PreloadBoot');
  }

  preload() {
    this.cameras.main.setBackgroundColor('#05070d');
    this.load.image('loading_bg', ART.loading_bg);
  }

  create() {
    this.scene.start('Boot');
  }
}
