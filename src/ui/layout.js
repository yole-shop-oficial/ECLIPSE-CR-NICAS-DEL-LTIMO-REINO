// Utilidades de layout responsive para que el juego se vea perfecto
// en cualquier pantalla y orientación, sin scroll y sin deformar el arte.

/**
 * Escala una imagen para cubrir completamente un área (comportamiento tipo
 * CSS `background-size: cover`), centrada. Evita bandas negras y deformación.
 */
export function coverImage(image, width, height) {
  const scale = Math.max(width / image.width, height / image.height);
  image.setScale(scale);
  image.setPosition(width / 2, height / 2);
  return image;
}

/**
 * Escala una imagen para que quepa completamente dentro de un área
 * (comportamiento tipo `background-size: contain`), sin recortarla.
 */
export function containImage(image, width, height, maxScale = Infinity) {
  const scale = Math.min(width / image.width, height / image.height, maxScale);
  image.setScale(scale);
  return image;
}

/**
 * Registra un listener de resize en una escena Phaser que vuelve a construir
 * la escena de forma segura (evita fugas de listeners al apagar la escena).
 */
export function onResize(scene, handler) {
  scene.scale.on('resize', handler);
  scene.events.once('shutdown', () => scene.scale.off('resize', handler));
  scene.events.once('destroy', () => scene.scale.off('resize', handler));
}

/** Tamaño de fuente responsive con límites mín/máx, basado en el ancho de pantalla. */
export function responsiveFont(width, ratio, min = 12, max = 96) {
  return Math.max(min, Math.min(max, Math.round(width * ratio)));
}

/** true si la pantalla actual está en orientación vertical (portrait). */
export function isPortrait(width, height) {
  return height >= width;
}

/**
 * Reconstruye la escena al cambiar tamaño/orientación, mediante un
 * pequeño debounce para evitar rebuilds en cascada mientras el usuario
 * rota el dispositivo o redimensiona la ventana.
 */
export function onResizeRebuild(scene, delay = 180, restartData = undefined) {
  let timer = null;
  const handler = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (scene.scene.isActive()) scene.scene.restart(restartData);
    }, delay);
  };
  scene.scale.on('resize', handler);
  scene.events.once('shutdown', () => {
    if (timer) clearTimeout(timer);
    scene.scale.off('resize', handler);
  });
}
