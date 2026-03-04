const fs = require('fs');
const path = require('path');

const dirs = [
  'c:/devfreeguy/projects/clients/others/next-js/tripfi/components/chatroom',
  'c:/devfreeguy/projects/clients/others/next-js/tripfi/components/auth',
  'c:/devfreeguy/projects/clients/others/next-js/tripfi/components/landing',
  'c:/devfreeguy/projects/clients/others/next-js/tripfi/components/shared',
  'c:/devfreeguy/projects/clients/others/next-js/tripfi/components/about',
  'c:/devfreeguy/projects/clients/others/next-js/tripfi/app'
];

const patterns = {
  BUTTONS: /<button\b/,
  INPUTS: /<input\b/,
  CARDS: /bg-surface.*?border-border.*?rounded/,
  DIALOGS: /backdrop|AnimatePresence|motion\.div/,
  SCROLL_AREAS: /overflow-y-auto|overflow-scroll/,
  SEPARATORS: /<hr\b|border-t/,
  SKELETONS: /animate-pulse.*?bg-surface/,
  TOOLTIPS: /title=/,
  TEXTAREAS: /<textarea\b/,
  BADGES: /text-\[\d+px\].*?uppercase|AI\b|TESTNET\b|UPCOMING\b/i
};

function walk(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath, fileList);
    } else if (filePath.endsWith('.tsx') && (!dir.includes('app') || filePath.endsWith('page.tsx'))) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = dirs.flatMap(dir => walk(dir));
let report = '# Replacement Map\n\n';

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const matches = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let matched = false;
    for (const [type, regex] of Object.entries(patterns)) {
      if (regex.test(line)) {
        matches.push(`    Line ${i + 1} (${type}): ${line.trim()}`);
        matched = true;
        break;
      }
    }
  }

  if (matches.length > 0) {
    report += `File: ${file.replace(/\\/g, '/').split('tripfi/')[1]}\n`;
    report += matches.join('\n') + '\n\n';
  }
}

fs.writeFileSync('C:/Users/User/.gemini/antigravity/brain/7c9a39c6-cf30-4764-88c9-4994b37bac6e/replacement_map.md', report);
console.log('Generated replacement_map.md');
