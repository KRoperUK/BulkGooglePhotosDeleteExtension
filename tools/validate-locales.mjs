#!/usr/bin/env node
// Validate the _locales i18n bundle used for the Chrome Web Store listing.
//
// Checks, for every _locales/<lang>/messages.json:
//   - the file is valid JSON
//   - the keys the manifest references (extName, extDesc) are present and non-empty
//   - extDesc stays within the store summary limit (132 chars)
//   - the manifest's default_locale actually exists
//
// Run with: node tools/validate-locales.mjs

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SUMMARY_LIMIT = 132;
const REQUIRED_KEYS = ['extName', 'extDesc'];

const manifest = JSON.parse(readFileSync('manifest.json', 'utf8'));
const errors = [];

const defaultLocale = manifest.default_locale;
if (!defaultLocale) {
  errors.push('manifest.json has no "default_locale" but _locales validation was requested');
}

const localesDir = '_locales';
if (!existsSync(localesDir)) {
  console.error('no _locales/ directory found');
  process.exit(1);
}

const locales = readdirSync(localesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

if (defaultLocale && !locales.includes(defaultLocale)) {
  errors.push(`default_locale "${defaultLocale}" has no _locales/${defaultLocale}/ directory`);
}

for (const locale of locales) {
  const file = join(localesDir, locale, 'messages.json');
  if (!existsSync(file)) {
    errors.push(`${locale}: missing messages.json`);
    continue;
  }
  let msgs;
  try {
    msgs = JSON.parse(readFileSync(file, 'utf8'));
  } catch (err) {
    errors.push(`${locale}: invalid JSON (${err.message})`);
    continue;
  }
  for (const key of REQUIRED_KEYS) {
    const entry = msgs[key];
    if (!entry || typeof entry.message !== 'string' || entry.message.trim() === '') {
      errors.push(`${locale}: missing or empty "${key}.message"`);
      continue;
    }
    if (key === 'extDesc' && entry.message.length > SUMMARY_LIMIT) {
      errors.push(
        `${locale}: extDesc is ${entry.message.length} chars, over the ${SUMMARY_LIMIT}-char store summary limit`
      );
    }
  }
  const desc = msgs.extDesc?.message ?? '';
  console.log(`ok  ${locale.padEnd(6)} extDesc=${desc.length}/${SUMMARY_LIMIT}`);
}

if (errors.length) {
  console.error('\nlocale validation failed:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`\nall ${locales.length} locales valid`);
