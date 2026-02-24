const fs = require('fs');
const path = require('path');

const jaPath = path.join(__dirname, 'locales', 'ja.json');
const enPath = path.join(__dirname, 'locales', 'en.json');

const jaDict = JSON.parse(fs.readFileSync(jaPath, 'utf-8'));
const enDict = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

function getKeys(obj, prefix = '') {
    let keys = [];
    for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            keys = keys.concat(getKeys(value, fullKey));
        } else {
            keys.push(fullKey);
        }
    }
    return keys;
}

const jaKeys = new Set(getKeys(jaDict));
const enKeys = new Set(getKeys(enDict));

let missingKeys = [];

for (const key of jaKeys) {
    if (!enKeys.has(key)) {
        missingKeys.push(`[Missing in EN]: ${key}`);
    }
}

for (const key of enKeys) {
    if (!jaKeys.has(key)) {
        missingKeys.push(`[Missing in JA]: ${key}`);
    }
}

if (missingKeys.length > 0) {
    console.error("i18n Validation Failed! Missing keys found:");
    missingKeys.forEach(msg => console.error(msg));
    process.exit(1);
} else {
    console.log("i18n validation passed. All translation keys match between Japanese and English.");
    process.exit(0);
}
