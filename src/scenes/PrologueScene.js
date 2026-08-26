import Phaser from 'phaser';
import { PROLOGUE_SLIDES } from '../data/story.js';
import { coverImage, onResizeRebuild } from '../ui/layout.js';

export default class PrologueScene extends Phaser.Scene {
  constructor() {
    super('Prologue');
  }

  create(data) {
    const { width, height } = this.scale;
    this.index = data && data.startIndex ? data.startIndex : 0;
    this.cameras.main.fadeIn(600, 0, 0, 0);

    this.bg = this.add.image(0, 0, PROLOGUE_SLIDES[this.index].image);
    coverImage(this.bg, width, height);
    this.bg.setAlpha(0);
    this.tweens.add({ targets: this.bg, alpha: 1, duration: 900 });

    this.overlay = this.add.rectangle(width / 2, height, width, height * 0.5, 0x000000, 0.55).setOrigin(0.5, 1);

    this.caption = this.add
      .text(width / 2, height * 0.86, '', {
        fontFamily: 'Noto Sans, sans-serif',
        fontSize: Math.max(15, Math.round(width * 0.02)) + 'px',
        color: '#f0e6d2',
        align: 'center',
        wordWrap: { width: Math.min(820, width * 0.85) },
        lineSpacing: 6,
      })
      .setOrigin(0.5, 0);

    this.skipBtn = this.add
      .text(width - 24, 24, 'Saltar ›', {
        fontFamily: 'Noto Sans, sans-serif',
        fontSize: '16px',
        color: '#cfd9ef',
      })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true });
    this.skipBtn.on('pointerdown', () => this.goToNext(true));
    this.skipBtn.on('pointerover', () => this.skipBtn.setColor('#ffd77a'));
    this.skipBtn.on('pointerout', () => this.skipBtn.setColor('#cfd9ef'));

    this.tapHint = this.add
      .text(width / 2, height - 20, 'Toca para continuar', {
        fontFamily: 'Noto Sans, sans-serif',
        fontSize: '13px',
        color: '#8ea0c4',
      })
      .setOrigin(0.5, 1);
    this.tweens.add({ targets: this.tapHint, alpha: 0.3, duration: 900, yoyo: true, repeat: -1 });

    this.input.on('pointerdown', (p) => {
      if (p.y < 60 && p.x > width - 100) return; // evita conflicto con skip
      this.advance();
    });

    this.typeCaption(PROLOGUE_SLIDES[this.index].caption);

    onResizeRebuild(this, 180, { startIndex: this.index });
  }

  typeCaption(text) {
    this.caption.setText('');
    let i = 0;
    if (this.typeTimer) this.typeTimer.remove();
    this.typeTimer = this.time.addEvent({
      delay: 22,
      repeat: text.length - 1,
      callback: () => {
        i++;
        this.caption.setText(text.slice(0, i));
      },
    });
  }

  advance() {
    this.index++;
    if (this.index >= PROLOGUE_SLIDES.length) {
      this.goToNext(false);
      return;
    }
    const slide = PROLOGUE_SLIDES[this.index];
    const { width, height } = this.scale;
    const newBg = this.add.image(0, 0, slide.image).setAlpha(0);
    coverImage(newBg, width, height);
    this.overlay.setDepth(1);
    this.caption.setDepth(2);
    this.skipBtn.setDepth(3);
    this.tapHint.setDepth(3);

    this.tweens.add({
      targets: newBg,
      alpha: 1,
      duration: 700,
      onComplete: () => {
        this.bg.destroy();
        this.bg = newBg;
      },
    });

    this.typeCaption(slide.caption);
  }

  goToNext(skipped) {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('CharacterSelect');
    });
  }
}
