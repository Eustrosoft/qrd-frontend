const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

const version = packageJson.version;

const indexFilePath = path.join(__dirname, '../src/index.html');

// Read the existing index.html content
let content = fs.readFileSync(indexFilePath, 'utf-8');

// Check if the version meta tag already exists
if (content.includes('name="version"')) {
  // If it exists, replace it
  const regex = /<meta name="version" content="([^"]+)">/;
  content = content.replace(regex, `<meta name="version" content="${version}">`);
} else {
  // If it doesn't exist, add it to the head
  const metaTag = `    <meta name="version" content="${version}">\n`;
  const insertAt = content.indexOf('</head>');
  content = content.slice(0, insertAt) + metaTag + content.slice(insertAt);
}

// Write the updated content back to index.html
fs.writeFileSync(indexFilePath, content, { flag: 'w' });
console.log(`Version ${version} has been added/updated in index.html`);
