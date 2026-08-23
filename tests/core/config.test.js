import test from 'node:test';
import assert from 'node:assert/strict';
import { createConfig, detectQualityTier, QUALITY_PRESETS, QUALITY_TIERS } from '../../src/core/config.js';

test('detectQualityTier cubre gamas baja → ultra', () => {
  assert.equal(detectQualityTier({ deviceMemory: 1, hardwareConcurrency: 2 }), 'LOW');
  assert.equal(detectQualityTier({ deviceMemory: 3, hardwareConcurrency: 4 }), 'MEDIUM');
  assert.equal(detectQualityTier({ deviceMemory: 6, hardwareConcurrency: 8 }), 'HIGH');
  assert.equal(detectQualityTier({ deviceMemory: 8, hardwareConcurrency: 8 }), 'ULTRA');
});

test('createConfig trae preset coherente con el tier', () => {
  const config = createConfig({ qualityTier: 'LOW' });
  assert.equal(config.qualityTier, 'LOW');
  assert.equal(config.quality.particles, QUALITY_PRESETS.LOW.particles);
  assert.ok(QUALITY_TIERS.includes(config.qualityTier));
});

test('la configuración es inmutable', () => {
  const config = createConfig({});
  assert.throws(() => { config.version = 'hack'; }, TypeError);
});

test('breakpoints móviles prioritarios presentes', () => {
  const config = createConfig({});
  for (const bp of [320, 360, 412, 430]) assert.ok(config.breakpoints.includes(bp));
});
