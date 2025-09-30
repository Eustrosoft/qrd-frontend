import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const DIST_DIR = path.resolve('dist');

const COMPRESSIBLE_EXT = ['.js', '.css', '.html', '.svg'];

function compressFile(filePath, algorithm) {
  const content = fs.readFileSync(filePath);
  let compressed;
  let ext;

  if (algorithm === 'gzip') {
    compressed = zlib.gzipSync(content, { level: 9 });
    ext = '.gz';
  } else if (algorithm === 'brotli') {
    compressed = zlib.brotliCompressSync(content, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
      },
    });
    ext = '.br';
  } else {
    return;
  }

  const outPath = filePath + ext;
  if (!fs.existsSync(outPath)) {
    fs.writeFileSync(outPath, compressed);
    console.log(`Compressed: ${path.relative(DIST_DIR, outPath)}`);
  }
}

function walk(dir, callback) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

walk(DIST_DIR, (filePath) => {
  const ext = path.extname(filePath);
  if (COMPRESSIBLE_EXT.includes(ext)) {
    compressFile(filePath, 'gzip');
    compressFile(filePath, 'brotli');
  }
});

console.log('Compression finished.');
