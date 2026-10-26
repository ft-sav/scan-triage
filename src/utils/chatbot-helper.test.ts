import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractScamKeySignals,
  calculateCloudPointerDisplacement,
  formatTimestamp,
} from './chatbot-helper.js';

test('extractScamKeySignals identifies Digital Arrest scam', () => {
  const result = extractScamKeySignals('Mumbai Police DCP called on Skype claiming money laundering in digital arrest');
  assert.equal(result.detectedCategory, 'Digital Arrest / Fake Police Summons');
  assert.equal(result.isUrgent, true);
  assert.ok(result.confidence >= 95);
});

test('extractScamKeySignals identifies FedEx customs extortion', () => {
  const result = extractScamKeySignals('FedEx parcel with narcotics seized by customs in Taiwan');
  assert.equal(result.detectedCategory, 'FedEx / Customs Narcotics Extortion');
  assert.equal(result.isUrgent, true);
});

test('extractScamKeySignals identifies APK malware vector', () => {
  const result = extractScamKeySignals('Download BSES electricity meter update .apk before 9:30 PM');
  assert.equal(result.detectedCategory, 'Malicious APK / Smart Meter Trojan');
  assert.equal(result.isUrgent, true);
});

test('extractScamKeySignals identifies Telegram prepaid review tasks', () => {
  const result = extractScamKeySignals('Telegram VIP task review Google maps hotels earn daily profit');
  assert.equal(result.detectedCategory, 'Telegram Task & Prepaid Review Scam');
  assert.equal(result.isUrgent, false);
});

test('calculateCloudPointerDisplacement parts clouds within radius', () => {
  const inside = calculateCloudPointerDisplacement(10, 10, 15, 12, 1.0);
  assert.ok(inside.distance < 60);
  assert.notEqual(inside.dx, 0);
  assert.notEqual(inside.dz, 0);

  const outside = calculateCloudPointerDisplacement(200, 200, 0, 0, 1.0);
  assert.equal(outside.dx, 0);
  assert.equal(outside.dz, 0);
});

test('formatTimestamp returns non-empty string', () => {
  const ts = formatTimestamp(new Date('2026-05-10T14:30:00Z'));
  assert.ok(ts.length > 0);
});
