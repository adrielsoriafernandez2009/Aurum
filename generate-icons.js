const sharp = require('sharp');
const fs = require('fs');

async function generateIcons() {
  const svgBuffer = fs.readFileSync('./public/icon.svg');
  
  await sharp(svgBuffer)
    .resize(192, 192)
    .toFile('./public/icon-192x192.png');
    
  await sharp(svgBuffer)
    .resize(512, 512)
    .toFile('./public/icon-512x512.png');

  // Also apple-icon.png in app folder
  await sharp(svgBuffer)
    .resize(180, 180)
    .toFile('./src/app/apple-icon.png');
    
  console.log('Icons generated successfully.');
}

generateIcons().catch(console.error);
