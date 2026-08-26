import Phaser from 'phaser';
import { CARDS, RARITY_COLORS, RARITY_LABEL, ELEMENTS } from '../data/cards.js';

export default class CardCollectionScene extends Phaser.Scene {
  constructor() {
    super('CardCollection');
  }

  create() {
    const { width, height } = this.scale;
    this.owned = JSON.parse(localStorage.getItem('seiryu_cards') || '[]');

    this.bgOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0x02040a, 0.96).setInteractive();

    this.add
      .text(width / 2, 36, 'CÓDICE DE CARTAS', {
        fontFamily: 'Cinzel, serif',
        fontSize: Math.max(22, Math.round(width * 0.035)) + 'px',
        color: '#ffe8b0',
        fontStyle: '900',
      })
      .setOrigin(0.5)
      .setShadow(0, 0, '#ff9a3a', 12, true, true);

    this.add
      .text(width / 2, 70, `${this.owned.length} / ${CARDS.length} cartas descubiertas`, {
        fontFamily: 'Noto Sans, sans-serif',
        fontSize: '13px',
        color: '#9fb3d8',
      })
      .setOrigin(0.5);

    const closeBtn = this.add
      .text(width - 24, 26, '✕', {
        fontFamily: 'Noto Sans, sans-serif',
        fontSize: '26px',
        color: '#ffcfcf',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.scene.stop());

    // Grid de cartas
    const cols = width < 520 ? 3 : width < 900 ? 4 : 5;
    const cellSize = Math.min(150, (width - 60) / cols - 14);
    const gap = 14;
    const totalW = cols * cellSize + (cols - 1) * gap;
    const startX = width / 2 - totalW / 2 + cellSize / 2;
    const startY = 120;

    CARDS.forEach((card, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (cellSize + gap);
      const y = startY + row * (cellSize * 1.42 + gap);
      this.createCardThumb(card, x, y, cellSize, this.owned.includes(card.id));
    });

    this.cameras.main.fadeIn(300, 0, 0, 0);
  }

  createCardThumb(card, x, y, size, owned) {
    const h = size * 1.4;
    const color = owned ? RARITY_COLORS[card.rarity] : 0x333844;
    const frame = this.add
      .rectangle(x, y, size, h, 0x0d1424, owned ? 1 : 0.7)
      .setStrokeStyle(2, color, owned ? 1 : 0.6)
      .setInteractive({ useHandCursor: true });

    if (owned) {
      const art = this.add.image(x, y - h * 0.12, `art_${card.id}`);
      art.setScale((size * 0.8) / art.width);
      this.add
        .text(x, y + h * 0.28, card.name, {
          fontFamily: 'Noto Sans, sans-serif',
          fontSize: Math.max(10, Math.round(size * 0.09)) + 'px',
          color: '#ffe8b0',
          align: 'center',
          wordWrap: { width: size - 10 },
        })
        .setOrigin(0.5, 0);
      this.add
        .text(x, y - h / 2 + 10, RARITY_LABEL[card.rarity], {
          fontFamily: 'Noto Sans, sans-serif',
          fontSize: '9px',
          color: Phaser.Display.Color.IntegerToColor(color).rgba,
        })
        .setOrigin(0.5, 0);
    } else {
      this.add
        .text(x, y, '?', {
          fontFamily: 'Cinzel, serif',
          fontSize: Math.round(size * 0.35) + 'px',
          color: '#555c6e',
        })
        .setOrigin(0.5);
    }

    frame.on('pointerover', () => frame.setStrokeStyle(3, owned ? 0xffffff : 0x555c6e, 1));
    frame.on('pointerout', () => frame.setStrokeStyle(2, color, owned ? 1 : 0.6));
    frame.on('pointerdown', () => this.openDetail(card, owned));
  }

  openDetail(card, owned) {
    const { width, height } = this.scale;
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85).setDepth(50).setInteractive();

    const panelW = Math.min(360, width * 0.85);
    const panelH = Math.min(520, height * 0.85);
    const color = owned ? RARITY_COLORS[card.rarity] : 0x555c6e;

    const panel = this.add
      .rectangle(width / 2, height / 2, panelW, panelH, 0x0d1424, 0.98)
      .setStrokeStyle(3, color, 1)
      .setDepth(51);

    const elements = [overlay, panel];

    if (owned) {
      const art = this.add.image(width / 2, height / 2 - panelH * 0.22, `art_${card.id}`).setDepth(52);
      art.setScale((panelW * 0.6) / art.width);
      elements.push(art);

      const name = this.add
        .text(width / 2, height / 2 - panelH * 0.02, card.name, {
          fontFamily: 'Cinzel, serif',
          fontSize: '20px',
          color: '#ffe8b0',
          fontStyle: 'bold',
          align: 'center',
          wordWrap: { width: panelW - 40 },
        })
        .setOrigin(0.5, 0)
        .setDepth(52);
      elements.push(name);

      const meta = this.add
        .text(
          width / 2,
          height / 2 + panelH * 0.08,
          `${card.title}\n${RARITY_LABEL[card.rarity]} · ${ELEMENTS[card.element].label}\nATK ${card.atk}  DEF ${card.def}  HP ${card.hp}`,
          {
            fontFamily: 'Noto Sans, sans-serif',
            fontSize: '13px',
            color: '#cfe3ff',
            align: 'center',
            lineSpacing: 4,
          }
        )
        .setOrigin(0.5, 0)
        .setDepth(52);
      elements.push(meta);

      const skill = this.add
        .text(width / 2, height / 2 + panelH * 0.24, `✦ ${card.skill}`, {
          fontFamily: 'Noto Sans, sans-serif',
          fontSize: '12px',
          color: '#ffd77a',
          align: 'center',
          wordWrap: { width: panelW - 50 },
        })
        .setOrigin(0.5, 0)
        .setDepth(52);
      elements.push(skill);

      const lore = this.add
        .text(width / 2, height / 2 + panelH * 0.35, `"${card.lore}"`, {
          fontFamily: 'Noto Sans, sans-serif',
          fontSize: '11px',
          fontStyle: 'italic',
          color: '#8ea0c4',
          align: 'center',
          wordWrap: { width: panelW - 50 },
        })
        .setOrigin(0.5, 0)
        .setDepth(52);
      elements.push(lore);
    } else {
      const q = this.add
        .text(width / 2, height / 2 - 20, '?', {
          fontFamily: 'Cinzel, serif',
          fontSize: '64px',
          color: '#555c6e',
        })
        .setOrigin(0.5)
        .setDepth(52);
      const hint = this.add
        .text(width / 2, height / 2 + 40, 'Explora el mundo para descubrir esta carta', {
          fontFamily: 'Noto Sans, sans-serif',
          fontSize: '13px',
          color: '#9fb3d8',
          align: 'center',
          wordWrap: { width: panelW - 50 },
        })
        .setOrigin(0.5)
        .setDepth(52);
      elements.push(q, hint);
    }

    const destroyAll = () => elements.forEach((e) => e.destroy());
    overlay.on('pointerdown', destroyAll);
  }
}
