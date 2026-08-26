#!/usr/bin/env bash
# Optimiza y convierte los assets de arte a WebP ultraligero para SEIRYU TACTICS.
# - Fondos cinematográficos: redimensionados a máx 1280px de ancho, WebP calidad 72.
# - Personajes (con fondo blanco a limpiar): transparencia + trim + WebP calidad 85.
# - Iconos/cartas: WebP calidad 85 sin pérdida de nitidez.
set -e

SRC="public/assets/art"
OUT="public/assets/art"

echo "== Fondos cinematográficos (backgrounds) =="
for name in loading_bg title_bg menu_bg prologue_1 prologue_2 prologue_3 world_map; do
  if [ -f "$SRC/$name.jpg" ]; then
    convert "$SRC/$name.jpg" -resize 1280x720^ -gravity center -extent 1280x720 \
      -strip -quality 72 -define webp:method=6 "$OUT/$name.webp"
    echo "  -> $name.webp ($(du -h "$OUT/$name.webp" | cut -f1))"
  fi
done

echo "== Personajes (con recorte de fondo blanco) =="
for name in hero_male hero_female; do
  if [ -f "$SRC/$name.png" ]; then
    convert "$SRC/$name.png" -fuzz 8% -transparent white -trim +repage \
      -resize 640x1200 -strip -quality 85 -define webp:method=6 "$OUT/$name.webp"
    echo "  -> $name.webp ($(du -h "$OUT/$name.webp" | cut -f1))"
  fi
done

echo "== Reverso de cartas =="
if [ -f "$SRC/card_back.png" ]; then
  convert "$SRC/card_back.png" -resize 512x512 -strip -quality 85 \
    -define webp:method=6 "$OUT/card_back.webp"
  echo "  -> card_back.webp ($(du -h "$OUT/card_back.webp" | cut -f1))"
fi

echo "== Limpieza de originales pesados =="
rm -f "$SRC"/*.jpg
find "$SRC" -maxdepth 1 -name "*.png" ! -name "*.webp" -delete

echo "Listo. Tamaño total de assets/art:"
du -sh "$OUT"
