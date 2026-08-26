import Phaser from 'phaser';
import PreloadBootScene from './scenes/PreloadBootScene.js';
import BootScene from './scenes/BootScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import PrologueScene from './scenes/PrologueScene.js';
import CharacterSelectScene from './scenes/CharacterSelectScene.js';
import WorldScene from './scenes/WorldScene.js';
import CardCollectionScene from './scenes/CardCollectionScene.js';

// Registro del Service Worker para soporte offline-first y PWA instalable.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('No se pudo registrar el Service Worker:', err);
    });
  });
}

// Captura el evento de instalación para ofrecer un botón "Instalar app" en el menú.
window.deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  window.deferredInstallPrompt = event;
  window.dispatchEvent(new CustomEvent('seiryu:install-available'));
});

function setRealViewportHeight() {
  // Corrige el 100vh en móviles (barras de navegador dinámicas) usando
  // la altura real de la ventana visible, y evita cualquier scroll.
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setRealViewportHeight();
window.addEventListener('resize', setRealViewportHeight);
window.addEventListener('orientationchange', setRealViewportHeight);

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: '#05070d',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: '100%',
    height: '100%',
  },
  scene: [PreloadBootScene, BootScene, MainMenuScene, PrologueScene, CharacterSelectScene, WorldScene, CardCollectionScene],
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: true,
  },
  fps: {
    target: 60,
  },
};

// eslint-disable-next-line no-new
const game = new Phaser.Game(config);

// Evita el "bounce"/scroll táctil del navegador dentro del canvas en móviles.
window.addEventListener(
  'touchmove',
  (e) => {
    e.preventDefault();
  },
  { passive: false }
);

export default game;
