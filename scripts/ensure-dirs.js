import fs from 'fs';
import path from 'path';

// Directory paths
const distDir = path.resolve('dist');
const esmDir = path.join(distDir, 'esm');
const modernDir = path.join(distDir, 'modern');

// Create directories if they don't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

if (!fs.existsSync(esmDir)) {
  fs.mkdirSync(esmDir, { recursive: true });
}

if (!fs.existsSync(modernDir)) {
  fs.mkdirSync(modernDir, { recursive: true });
}

console.log('Build directories created successfully'); 