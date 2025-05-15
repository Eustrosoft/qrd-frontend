const fs = require('fs');
const path = require('path');

const baseFilePath = 'src/locale/messages.json'; // freshly extracted
const locales = ['ru', 'en']; // your supported locales
const targetDir = 'src/locale';

function loadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return { locale: '', translations: {} };
  }
}

function mergeTranslations(base, existing) {
  const result = {
    locale: existing.locale || '',
    translations: {},
  };

  for (const key of Object.keys(base.translations)) {
    // Prefer existing translation if available, otherwise fall back to source
    result.translations[key] = existing.translations[key] || base.translations[key];
  }

  return result;
}

// Load the freshly extracted messages
const base = loadJson(baseFilePath);

for (const locale of locales) {
  const targetPath = path.join(targetDir, `messages.${locale}.json`);
  const existing = loadJson(targetPath);
  const merged = mergeTranslations(base, existing);
  fs.writeFileSync(targetPath, JSON.stringify(merged, null, 2));
  console.log(`Updated and cleaned: ${targetPath}`);
}
