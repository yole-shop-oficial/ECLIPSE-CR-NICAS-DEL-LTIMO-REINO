import Phaser from 'phaser';
import { CARDS } from '../data/cards.js';
import { PROLOGUE_SLIDES } from '../data/story.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.cameras.main.setBackgroundColor('#05070d');

    // Fondo de pantalla de carga
    this.load.image('loading_bg', '/assets/art/loading_bg.jpg');
    this.load.image('title_bg', '/assets/art/title_bg.jpg');

    this.createLoadingUI();

    // Fondos y arte principal
    this.load.image('menu_bg', '/assets/art/menu_bg.jpg');
    this.load.image('hero_male', '/assets/art/hero_male.png');
    this.load.image('hero_female', '/assets/art/hero_female.png');
    this.load.image('card_back', '/assets/art/card_back.png');
    this.load.image('world_map', '/assets/art/world_map.jpg');

    PROLOGUE_SLIDES.forEach((slide) => {
      this.load.image(slide.image, `/assets/art/${slide.image}.jpg`);
    });

    // Generamos texturas proceduralmente para las cartas (ilustración simbólica por elemento)
    this.load.on('progress', (value) => {
      if (this.progressBar) this.updateBar(value);
    });
  }

  createLoadingUI() {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, 'loading_bg').setDisplaySize(width, height).setDepth(0);
    this.add.rectangle(width / 2, height / 2, width, height, 0x05070d, 0.45).setDepth(1);

    this.add
      .text(width / 2, height * 0.32, 'SEIRYU TACTICS', {
        fontFamily: 'Cinzel, serif',
        fontSize: Math.round(width * 0.06) + 'px',
        color: '#ffd77a',
        fontStyle: '900',
      })
      .setOrigin(0.5)
      .setDepth(2)
      .setShadow(0, 0, '#ff8a3a', 18, true, true);

    this.add
      .text(width / 2, height * 0.32 + Math.round(width * 0.06) * 0.9, 'La Era del Dragón Eterno', {
        fontFamily: 'Cinzel, serif',
        fontSize: Math.round(width * 0.022) + 'px',
        color: '#cfe3ff',
      })
      .setOrigin(0.5)
      .setDepth(2);

    const barW = Math.min(520, width * 0.7);
    const barH = 18;
    const barX = width / 2 - barW / 2;
    const barY = height * 0.72;

    this.add
      .rectangle(width / 2, barY, barW + 8, barH + 8)
      .setStrokeStyle(2, 0xffd77a, 0.8)
      .setDepth(2);
    this.progressBg = this.add.rectangle(width / 2, barY, barW, barH, 0x0d1424, 0.9).setDepth(2);
    this.progressBar = this.add
      .rectangle(barX, barY, 2, barH, 0x3aa0ff, 1)
      .setOrigin(0, 0.5)
      .setDepth(3);
    this.progressBar._fullW = barW;

    this.loadingLabel = this.add
      .text(width / 2, barY + 34, 'Invocando el mundo... 0%', {
        fontFamily: 'Noto Sans, sans-serif',
        fontSize: '16px',
        color: '#9fc3ff',
      })
      .setOrigin(0.5)
      .setDepth(2);
  }

  updateBar(value) {
    this.progressBar.width = Math.max(2, this.progressBar._fullW * value);
    this.loadingLabel.setText(`Invocando el mundo... ${Math.round(value * 100)}%`);
  }

  create() {
    this.generateCardTextures();
    this.time.delayedCall(400, () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('MainMenu'));
    });
  }

  // Genera una textura de "ilustración" simbólica por carta usando gráficos vectoriales,
  // así cada carta tiene una imagen única sin depender de más assets externos.
  generateCardTextures() {
    const size = 300;
    CARDS.forEach((card) => {
      const key = `art_${card.id}`;
      if (this.textures.exists(key)) return;
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      const elementColors = {
        dragon: [0x0b2545, 0x3aa0ff],
        fuego: [0x3a0b0b, 0xff5a3a],
        sombra: [0x150826, 0x8a5bff],
        luz: [0x2a2408, 0xffe066],
        naturaleza: [0x0b2612, 0x5be07a],
      };
      const [bg, fg] = elementColors[card.element] || [0x101010, 0xffffff];

      g.fillStyle(bg, 1);
      g.fillRect(0, 0, size, size);

      // Radial glow simulation with layered circles
      for (let i = 6; i > 0; i--) {
        g.fillStyle(fg, 0.06 * i);
        g.fillCircle(size / 2, size / 2, (i / 6) * size * 0.55);
      }

      // Silhouette symbol depending on element
      g.fillStyle(fg, 0.9);
      const cx = size / 2;
      const cy = size / 2;
      if (card.element === 'dragon') {
        g.fillTriangle(cx, cy - 90, cx - 70, cy + 60, cx + 70, cy + 60);
        g.fillCircle(cx, cy - 90, 18);
      } else if (card.element === 'fuego') {
        g.fillTriangle(cx, cy - 90, cx - 50, cy + 70, cx + 50, cy + 70);
      } else if (card.element === 'sombra') {
        g.fillCircle(cx, cy, 60);
        g.fillStyle(bg, 1);
        g.fillCircle(cx + 22, cy - 10, 50);
      } else if (card.element === 'luz') {
        for (let i = 0; i < 8; i++) {
          const ang = (i / 8) * Math.PI * 2;
          g.fillTriangle(
            cx, cy,
            cx + Math.cos(ang) * 90, cy + Math.sin(ang) * 90,
            cx + Math.cos(ang + 0.25) * 40, cy + Math.sin(ang + 0.25) * 40
          );
        }
      } else if (card.element === 'naturaleza') {
        g.fillCircle(cx, cy + 40, 50);
        g.fillTriangle(cx, cy - 90, cx - 40, cy + 30, cx + 40, cy + 30);
      }

      g.lineStyle(4, fg, 0.5);
      g.strokeRect(4, 4, size - 8, size - 8);

      g.generateTexture(key, size, size);
      g.destroy();
    });
  }
}
