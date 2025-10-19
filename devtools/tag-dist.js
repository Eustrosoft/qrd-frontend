const fs = require('fs');

// Read package.json
const packageJson = require('../package.json');
const version = packageJson.version;

// Define paths
const oldDir = 'dist';
const newDir = `dist_v${version}`;

// Check if dist exists
if (!fs.existsSync(oldDir)) {
  console.error(`Error: ${oldDir} directory does not exist. Build the app first.`);
  process.exit(1);
}

// Rename directory
try {
  fs.renameSync(oldDir, newDir);
  console.log(`Successfully renamed ${oldDir} to ${newDir}`);
} catch (error) {
  console.error('Error renaming directory:', error);
  process.exit(1);
}
