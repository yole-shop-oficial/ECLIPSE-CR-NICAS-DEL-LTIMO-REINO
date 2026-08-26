import Phaser from 'phaser';
import { CARDS, RARITY_COLORS } from '../data/cards.js';
import { coverImage, onResizeRebuild } from '../ui/layout.js';

const POIS = [
  { id: 'aurelia', name: 'Ruinas de Aurelia', x: 0.28, y: 0.32, kind: 'ruinas', desc: 'La antigua capital caída, ahora hogar de espíritus errantes.' },
  { id: 'bosque', name: 'Bosque Eterno', x: 0.62, y: 0.28, kind: 'bosque', desc: 'Un bosque milenario donde los árboles susurran secretos olvidados.' },
  { id: 'volcan', name: 'Cráter de Ashka', x: 0.75, y: 0.62, kind: 'volcan', desc: 'Tierra de fuego y salamandras, hogar de criaturas ígneas.' },
  { id: 'glaciar', name: 'Cumbre Helada', x: 0.18, y: 0.68, kind: 'glaciar', desc: 'Picos congelados donde habitan antiguos guardianes de piedra.' },
  { id: 'santuario', name: 'Santuario del Dragón', x: 0.48, y: 0.5, kind: 'santuario', desc: 'El corazón del mundo fragmentado, donde el poder de Seiryu aún resuena.' },
];

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super('World');
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.fadeIn(500, 0, 0, 0);

    const heroData = JSON.parse(localStorage.getItem('seiryu_hero') || 'null');
    this.hero = heroData || { name: 'Héroe', title: '', color: 0x3aa0ff };

    if (!localStorage.getItem('seiryu_cards')) {
      // Regalo inicial: 3 cartas comunes/raras al empezar
      const starter = ['espiritu_luciernaga', 'lobo_sombrio', 'brasa_menor'];
      localStorage.setItem('seiryu_cards', JSON.stringify(starter));
    }

    const map = this.add.image(0, 0, 'world_map');
    coverImage(map, width, height);
    map.setScale(map.scaleX * 1.15, map.scaleY * 1.15);
    this.mapImage = map;

    this.add.rectangle(width / 2, height / 2, width, height, 0x03060f, 0.15);

    // Marcadores de puntos de interés
    this.poiGroup = this.add.group();
    POIS.forEach((poi) => this.createPOI(poi, width, height));

    // HUD superior
    this.createTopHUD(width, height);

    // Barra inferior de accesos
    this.createBottomBar(width, height);

    onResizeRebuild(this);
  }

  createPOI(poi, width, height) {
    const x = poi.x * width;
    const y = poi.y * height;

    const glow = this.add.circle(x, y, 22, 0xffd77a, 0.25);
    const marker = this.add.circle(x, y, 12, 0xffd77a, 0.95).setStrokeStyle(2, 0xffffff, 0.9);
    marker.setInteractive({ useHandCursor: true });

    this.tweens.add({ targets: glow, scale: { from: 0.8, to: 1.6 }, alpha: { from: 0.35, to: 0 }, duration: 1600, repeat: -1 });

    const label = this.add
      .text(x, y + 22, poi.name, {
        fontFamily: 'Noto Sans, sans-serif',
        fontSize: '13px',
        color: '#ffe8b0',
        backgroundColor: '#00000066',
        padding: { x: 6, y: 3 },
      })
      .setOrigin(0.5, 0);

    marker.on('pointerdown', () => this.openPOI(poi));
    marker.on('pointerover', () => marker.setScale(1.3));
    marker.on('pointerout', () => marker.setScale(1));
  }

  openPOI(poi) {
    const { width, height } = this.scale;
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7).setDepth(20);
    const panelW = Math.min(460, width * 0.85);
    const panelH = 260;
    const panel = this.add
      .rectangle(width / 2, height / 2, panelW, panelH, 0x0d1424, 0.96)
      .setStrokeStyle(3, 0xffd77a, 1)
      .setDepth(21);

    const title = this.add
      .text(width / 2, height / 2 - panelH / 2 + 34, poi.name, {
        fontFamily: 'Cinzel, serif',
        fontSize: '22px',
        color: '#ffe8b0',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(22);

    const desc = this.add
      .text(width / 2, height / 2 - 20, poi.desc, {
        fontFamily: 'Noto Sans, sans-serif',
        fontSize: '14px',
        color: '#dbe6ff',
        align: 'center',
        wordWrap: { width: panelW - 60 },
      })
      .setOrigin(0.5)
      .setDepth(22);

    const exploreBtn = this.add
      .rectangle(width / 2 - 90, height / 2 + panelH / 2 - 40, 150, 46, 0x1a2b4d, 1)
      .setStrokeStyle(2, 0x3aa0ff)
      .setInteractive({ useHandCursor: true })
      .setDepth(22);
    const exploreLabel = this.add
      .text(width / 2 - 90, height / 2 + panelH / 2 - 40, 'Explorar', {
        fontFamily: 'Noto Sans, sans-serif',
        fontSize: '15px',
        color: '#cfe3ff',
      })
      .setOrigin(0.5)
      .setDepth(22);

    const closeBtn = this.add
      .rectangle(width / 2 + 90, height / 2 + panelH / 2 - 40, 150, 46, 0x3a1a1a, 1)
      .setStrokeStyle(2, 0xff5a5a)
      .setInteractive({ useHandCursor: true })
      .setDepth(22);
    const closeLabel = this.add
      .text(width / 2 + 90, height / 2 + panelH / 2 - 40, 'Cerrar', {
        fontFamily: 'Noto Sans, sans-serif',
        fontSize: '15px',
        color: '#ffcfcf',
      })
      .setOrigin(0.5)
      .setDepth(22);

    const elements = [overlay, panel, title, desc, exploreBtn, exploreLabel, closeBtn, closeLabel];
    const destroyAll = () => elements.forEach((e) => e.destroy());

    closeBtn.on('pointerdown', destroyAll);
    overlay.setInteractive();
    overlay.on('pointerdown', destroyAll);

    exploreBtn.on('pointerdown', () => {
      destroyAll();
      this.rewardCard(poi);
    });
  }

  rewardCard(poi) {
    const owned = JSON.parse(localStorage.getItem('seiryu_cards') || '[]');
    const pool = CARDS.filter((c) => !owned.includes(c.id));
    if (pool.length === 0) {
      this.showToast('Ya tienes todas las cartas de esta región. ¡Sigue explorando el mundo!');
      return;
    }
    const card = pool[Phaser.Math.Between(0, pool.length - 1)];
    owned.push(card.id);
    localStorage.setItem('seiryu_cards', JSON.stringify(owned));
    this.showCardReveal(card, poi);
  }

  showCardReveal(card, poi) {
    const { width, height } = this.scale;
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85).setDepth(30);

    const cardW = Math.min(240, width * 0.6);
    const cardH = cardW * 1.4;

    const cardBack = this.add.image(width / 2, height / 2, 'card_back').setDepth(31);
    cardBack.setScale(Math.min(cardW / cardBack.width, cardH / cardBack.height));

    this.tweens.add({
      targets: cardBack,
      scaleX: 0,
      duration: 300,
      delay: 500,
      onComplete: () => {
        cardBack.destroy();
        this.buildCardFace(card, width / 2, height / 2, cardW, cardH, 32);
      },
    });

    const info = this.add
      .text(width / 2, height / 2 + cardH / 2 + 40, `¡Has obtenido a ${card.name}!\n${poi.name}`, {
        fontFamily: 'Noto Sans, sans-serif',
        fontSize: '15px',
        color: '#ffe8b0',
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(32)
      .setAlpha(0);

    this.tweens.add({ targets: info, alpha: 1, duration: 500, delay: 900 });

    this.time.delayedCall(2600, () => {
      this.tweens.add({
        targets: [overlay, info],
        alpha: 0,
        duration: 400,
        onComplete: () => {
          overlay.destroy();
          info.destroy();
          this.children.list
            .filter((c) => c._cardFaceTag)
            .forEach((c) => c.destroy());
        },
      });
    });
  }

  buildCardFace(card, x, y, w, h, depth) {
    const container = this.add.container(x, y).setDepth(depth);
    container._cardFaceTag = true;
    const color = RARITY_COLORS[card.rarity] || 0xffffff;

    const frame = this.add.rectangle(0, 0, w, h, 0x0d1424, 1).setStrokeStyle(4, color, 1);
    const art = this.add.image(0, -h * 0.12, `art_${card.id}`);
    art.setScale((w * 0.82) / art.width);
    const name = this.add
      .text(0, h * 0.3, card.name, {
        fontFamily: 'Cinzel, serif',
        fontSize: Math.round(w * 0.075) + 'px',
        color: '#ffe8b0',
        align: 'center',
        wordWrap: { width: w * 0.85 },
      })
      .setOrigin(0.5, 0);

    container.add([frame, art, name]);
    container.setScale(0);
    this.tweens.add({ targets: container, scale: 1, duration: 350, ease: 'Back.easeOut' });
  }

  showToast(msg) {
    const { width, height } = this.scale;
    const t = this.add
      .text(width / 2, height * 0.15, msg, {
        fontFamily: 'Noto Sans, sans-serif',
        fontSize: '14px',
        color: '#ffe8b0',
        backgroundColor: '#0d1424dd',
        padding: { x: 16, y: 10 },
        align: 'center',
        wordWrap: { width: width * 0.8 },
      })
      .setOrigin(0.5)
      .setDepth(40);
    this.time.delayedCall(2200, () => t.destroy());
  }

  createTopHUD(width, height) {
    const bar = this.add.rectangle(width / 2, 30, width, 60, 0x03060f, 0.55).setOrigin(0.5);

    this.add
      .text(20, 30, `${this.hero.name}`, {
        fontFamily: 'Cinzel, serif',
        fontSize: '18px',
        color: '#ffe8b0',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5);

    this.add
      .text(20, 30 + 20, this.hero.title || '', {
        fontFamily: 'Noto Sans, sans-serif',
        fontSize: '12px',
        color: '#9fb3d8',
      })
      .setOrigin(0, 0.5);

    const owned = JSON.parse(localStorage.getItem('seiryu_cards') || '[]');
    this.cardCountText = this.add
      .text(width - 20, 30, `🂠 ${owned.length}/${CARDS.length}`, {
        fontFamily: 'Noto Sans, sans-serif',
        fontSize: '16px',
        color: '#ffe8b0',
      })
      .setOrigin(1, 0.5);
  }

  createBottomBar(width, height) {
    const barH = 84;
    this.add.rectangle(width / 2, height - barH / 2, width, barH, 0x03060f, 0.7);

    const buttons = [
      { label: 'Mundo', action: () => {} },
      {
        label: 'Cartas',
        action: () => {
          this.scene.launch('CardCollection');
          this.scene.bringToTop('CardCollection');
        },
      },
      { label: 'Menú', action: () => this.scene.start('MainMenu') },
    ];

    const btnW = Math.min(160, width / buttons.length - 20);
    const gap = (width - btnW * buttons.length) / (buttons.length + 1);

    buttons.forEach((b, i) => {
      const x = gap + i * (btnW + gap) + btnW / 2;
      const y = height - barH / 2;
      const rect = this.add
        .rectangle(x, y, btnW, 52, 0x0d1424, 0.9)
        .setStrokeStyle(2, 0xffd77a, 0.8)
        .setInteractive({ useHandCursor: true });
      const label = this.add
        .text(x, y, b.label, {
          fontFamily: 'Cinzel, serif',
          fontSize: '15px',
          color: '#ffe8b0',
        })
        .setOrigin(0.5);
      rect.on('pointerdown', () => {
        this.tweens.add({ targets: rect, scale: 0.94, duration: 80, yoyo: true });
        b.action();
      });
      rect.on('pointerover', () => rect.setFillStyle(0x18233d, 0.9));
      rect.on('pointerout', () => rect.setFillStyle(0x0d1424, 0.9));
    });
  }
}
