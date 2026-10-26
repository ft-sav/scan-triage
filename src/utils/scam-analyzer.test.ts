import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyScamPattern,
  generateIncidentRef,
  sanitizeScamInput,
} from './scam-analyzer';

test('sanitizes dangerous HTML and repeated whitespace', () => {
  const dirty = '  <b>Digital Arrest</b>\n\n\n\nTransfer now!  ';
  const clean = sanitizeScamInput(dirty);
  assert.equal(clean, 'Digital Arrest\n\nTransfer now!');
});

test('generates valid incident reference format', () => {
  const ref = generateIncidentRef('DIGITAL_ARREST');
  assert.match(ref, /^TRI-2026-DIG-[A-Z0-9]+$/);
});

test('detects Digital Arrest scam pattern with precautions and overcome guide', () => {
  const sample =
    'Mumbai Police Cyber Crime Unit calling on Skype regarding illegal SIM cards and arrest warrant. Stay on call.';
  const result = classifyScamPattern(sample);
  assert.equal(result.isScam, true);
  assert.equal(result.scamType, 'DIGITAL_ARREST');
  assert.equal(result.confidence, 99);
  assert.equal(result.badgeText, '100% FRAUD');
  assert.ok(result.calmingMessage.length > 20);
  assert.ok(result.howToOvercome.length > 20);
  assert.ok(result.precautions.length >= 3);
  assert.ok(result.scamTriangle.pressure.length > 10);
});

test('detects FedEx / Customs narcotics extortion pattern', () => {
  const sample =
    'Automated notification: FedEx parcel seized in Taiwan containing narcotics and passports tied to your Aadhaar card.';
  const result = classifyScamPattern(sample);
  assert.equal(result.isScam, true);
  assert.equal(result.scamType, 'FEDEX_CUSTOMS');
  assert.equal(result.badgeText, 'EXTORTION');
  assert.ok(result.precautions.length >= 3);
  assert.ok(result.howToOvercome.includes('Hang up'));
});

test('detects Malicious APK and electricity meter cutoff scam', () => {
  const sample =
    'Urgent: Your electricity power bill is unpaid. Power will disconnect at 9:30 PM. Download the meter update .apk now.';
  const result = classifyScamPattern(sample);
  assert.equal(result.isScam, true);
  assert.equal(result.scamType, 'APK_MALWARE');
  assert.equal(result.badgeText, 'MALWARE ALERT');
  assert.ok(result.precautions.some((a) => a.includes('AIRPLANE MODE')));
});

test('identifies benign transactional notification as low risk', () => {
  const sample =
    'Your order delivered successfully. Thank you for shopping with us. Welcome to our rewards program.';
  const result = classifyScamPattern(sample);
  assert.equal(result.isScam, false);
  assert.equal(result.scamType, 'LEGITIMATE');
  assert.equal(result.badgeColor, 'green');
});
