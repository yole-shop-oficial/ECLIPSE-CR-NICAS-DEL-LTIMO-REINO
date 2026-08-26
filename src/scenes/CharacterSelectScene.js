import Phaser from 'phaser';
import { coverImage, onResizeRebuild } from '../ui/layout.js';

const HEROES = [
  {
    id: 'kaito',
    name: 'Kaito',
    title: 'Espadachín del Alba',
    art: 'hero_male',
    desc: 'Guerrero ágil especializado en combate cuerpo a cuerpo y contraataques rápidos.',
    element: 'Luz',
    color: 0x3aa0ff,
  },
  {
    id: 'yuna',
    name: 'Yuna',
    title: 'Hechicera Carmesí',
    art: 'hero_female',
    desc: 'Maga ofensiva capaz de invocar espíritus y controlar el campo de batalla.',
    element: 'Sombra',
    color: 0xff5a7a,
  },
];

export default class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super('CharacterSelect');
  }

  create(data) {
    const { width, height } = this.scale;
    this.selected = (data && data.selected) || 0;

    coverImage(this.add.image(0, 0, 'title_bg'), width, height);
    this.add.rectangle(width / 2, height / 2, width, height, 0x03040a, 0.6);

    this.add
      .text(width / 2, height * 0.1, 'Elige a tu héroe', {
        fontFamily: 'Cinzel, serif',
        fontSize: Math.max(26, Math.round(width * 0.045)) + 'px',
        color: '#ffe8b0',
        fontStyle: '900',
      })
      .setOrigin(0.5)
      .setShadow(0, 0, '#ff9a3a', 16, true, true);

    this.add
      .text(width / 2, height * 0.1 + 40, 'Tu elección definirá tu camino en el mundo fragmentado', {
        fontFamily: 'Noto Sans, sans-serif',
        fontSize: '14px',
        color: '#9fb3d8',
      })
      .setOrigin(0.5);

    this.cards = [];
    const cardW = Math.min(280, width * 0.4);
    const cardH = Math.min(420, height * 0.62);
    const gap = Math.min(60, width * 0.08);
    const totalW = cardW * 2 + gap;
    const startX = width / 2 - totalW / 2 + cardW / 2;
    const cardY = height * 0.55;

    HEROES.forEach((hero, i) => {
      const x = startX + i * (cardW + gap);
      const container = this.add.container(x, cardY);

      const frame = this.add
        .rectangle(0, 0, cardW, cardH, 0x0d1424, 0.85)
        .setStrokeStyle(3, hero.color, 0.9);

      const art = this.add.image(0, -cardH * 0.08, hero.art);
      const artScale = Math.min((cardW * 0.85) / art.width, (cardH * 0.7) / art.height);
      art.setScale(artScale);

      const nameTxt = this.add
        .text(0, cardH * 0.32, hero.name, {
          fontFamily: 'Cinzel, serif',
          fontSize: '22px',
          color: '#ffe8b0',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      const titleTxt = this.add
        .text(0, cardH * 0.32 + 26, hero.title, {
          fontFamily: 'Noto Sans, sans-serif',
          fontSize: '13px',
          color: '#9fb3d8',
        })
        .setOrigin(0.5);

      container.add([frame, art, nameTxt, titleTxt]);
      container.setSize(cardW, cardH);
      container.setInteractive({ useHandCursor: true });
      container._frame = frame;
      container._hero = hero;

      container.on('pointerover', () => {
        if (this.selected !== i) frame.setStrokeStyle(3, 0xffffff, 0.5);
      });
      container.on('pointerout', () => {
        if (this.selected !== i) frame.setStrokeStyle(3, hero.color, 0.9);
      });
      container.on('pointerdown', () => this.select(i));

      this.cards.push(container);
    });

    this.descText = this.add
      .text(width / 2, cardY + cardH / 2 + 30, '', {
        fontFamily: 'Noto Sans, sans-serif',
        fontSize: '14px',
        color: '#dbe6ff',
        align: 'center',
        wordWrap: { width: Math.min(600, width * 0.85) },
      })
      .setOrigin(0.5, 0);

    const confirmY = height - 60;
    this.confirmBtn = this.add
      .rectangle(width / 2, confirmY, Math.min(320, width * 0.6), 60, 0x0d1424, 0.9)
      .setStrokeStyle(3, 0xffd77a, 1)
      .setInteractive({ useHandCursor: true });
    this.confirmLabel = this.add
      .text(width / 2, confirmY, 'CONFIRMAR', {
        fontFamily: 'Cinzel, serif',
        fontSize: '18px',
        color: '#ffe8b0',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.confirmBtn.on('pointerdown', () => this.confirm());
    this.confirmBtn.on('pointerover', () => this.confirmBtn.setFillStyle(0x18233d, 0.9));
    this.confirmBtn.on('pointerout', () => this.confirmBtn.setFillStyle(0x0d1424, 0.9));

    this.select(this.selected);
    this.cameras.main.fadeIn(500, 0, 0, 0);

    onResizeRebuild(this, 180, { selected: this.selected });
  }

  select(i) {
    this.selected = i;
    this.cards.forEach((c, idx) => {
      const isSel = idx === i;
      c._frame.setStrokeStyle(3, isSel ? 0xffd77a : c._hero.color, isSel ? 1 : 0.9);
      this.tweens.add({ targets: c, scale: isSel ? 1.05 : 1, duration: 200 });
    });
    this.descText.setText(HEROES[i].desc);
  }

  confirm() {
    const hero = HEROES[this.selected];
    localStorage.setItem('seiryu_hero', JSON.stringify(hero));
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('World');
    });
  }
}
