import Phaser from 'phaser';
import { GAME_TITLE, GAME_SUBTITLE } from '../data/story.js';
import { coverImage, onResizeRebuild } from '../ui/layout.js';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const { width, height } = this.scale;

    const bg = this.add.image(0, 0, 'menu_bg');
    coverImage(bg, width, height);
    this.applyKenBurns(bg);

    this.add.rectangle(width / 2, height / 2, width, height, 0x03040a, 0.35);
    // Gradient vignette bottom
    const grad = this.add.graphics();
    grad.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 1, 1);
    grad.fillRect(0, 0, width, height);
    grad.setAlpha(0);

    const vignette = this.add.graphics();
    vignette.fillStyle(0x000000, 1);
    vignette.fillRect(0, height * 0.72, width, height * 0.28);
    vignette.setAlpha(0.5);

    // Title
    const titleSize = Math.max(38, Math.round(width * 0.065));
    const title = this.add
      .text(width / 2, height * 0.22, GAME_TITLE, {
        fontFamily: 'Cinzel, serif',
        fontSize: titleSize + 'px',
        fontStyle: '900',
        color: '#ffe8b0',
      })
      .setOrigin(0.5)
      .setShadow(0, 0, '#ff9a3a', 24, true, true);

    this.add
      .text(width / 2, height * 0.22 + titleSize * 0.85, GAME_SUBTITLE, {
        fontFamily: 'Cinzel, serif',
        fontSize: Math.round(titleSize * 0.32) + 'px',
        color: '#cfe3ff',
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: title,
      scale: { from: 0.96, to: 1.02 },
      duration: 2400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Botón principal "Toca para entrar al mundo"
    const btnY = height * 0.62;
    const btnW = Math.min(460, width * 0.78);
    const btnH = 78;

    const btnGlow = this.add
      .rectangle(width / 2, btnY, btnW + 24, btnH + 24, 0xffb23a, 0.0)
      .setOrigin(0.5);

    const btnBg = this.add
      .rectangle(width / 2, btnY, btnW, btnH, 0x0d1424, 0.85)
      .setStrokeStyle(3, 0xffd77a, 1)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const btnLabel = this.add
      .text(width / 2, btnY, 'TOCA PARA ENTRAR AL MUNDO', {
        fontFamily: 'Cinzel, serif',
        fontSize: Math.max(16, Math.round(width * 0.02)) + 'px',
        color: '#ffe8b0',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: btnW - 40 },
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: [btnBg],
      alpha: { from: 0.85, to: 1 },
      duration: 900,
      yoyo: true,
      repeat: -1,
    });
    this.tweens.add({
      targets: btnGlow,
      alpha: { from: 0.15, to: 0.45 },
      scale: { from: 1, to: 1.06 },
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    const goNext = () => {
      btnBg.disableInteractive();
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        const hasSave = localStorage.getItem('seiryu_hero');
        this.scene.start(hasSave ? 'World' : 'Prologue');
      });
    };

    btnBg.on('pointerover', () => btnBg.setFillStyle(0x18233d, 0.9));
    btnBg.on('pointerout', () => btnBg.setFillStyle(0x0d1424, 0.85));
    btnBg.on('pointerdown', () => {
      this.tweens.add({ targets: [btnBg, btnLabel], scale: 0.96, duration: 90, yoyo: true });
      goNext();
    });

    // Sub-opciones
    const subY = height * 0.78;
    const hasSave = localStorage.getItem('seiryu_hero');
    if (hasSave) {
      const resetBtn = this.add
        .text(width / 2, subY, 'Reiniciar aventura', {
          fontFamily: 'Noto Sans, sans-serif',
          fontSize: '15px',
          color: '#9fb3d8',
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
      resetBtn.on('pointerover', () => resetBtn.setColor('#ffd77a'));
      resetBtn.on('pointerout', () => resetBtn.setColor('#9fb3d8'));
      resetBtn.on('pointerdown', () => {
        localStorage.removeItem('seiryu_hero');
        localStorage.removeItem('seiryu_cards');
        this.scene.restart();
      });
    }

    this.add
      .text(width / 2, height - 22, 'v0.1 · Fan-made anime open world card RPG', {
        fontFamily: 'Noto Sans, sans-serif',
        fontSize: '12px',
        color: '#5b6b8c',
      })
      .setOrigin(0.5);

    this.cameras.main.fadeIn(500, 0, 0, 0);

    onResizeRebuild(this);
  }

  applyKenBurns(image) {
    this.tweens.add({
      targets: image,
      scaleX: image.scaleX * 1.08,
      scaleY: image.scaleY * 1.08,
      duration: 20000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

}
