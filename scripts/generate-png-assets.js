const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const brandingDir = path.join(__dirname, '..', 'branding');

// Ensure branding directory exists
if (!fs.existsSync(brandingDir)) {
  fs.mkdirSync(brandingDir, { recursive: true });
}

function drawLogo(canvas, size) {
  const ctx = canvas.getContext('2d');
  canvas.width = size;
  canvas.height = size;
  
  const scale = size / 512;
  
  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  
  // Background circle with gradient
  const bgGrad = ctx.createLinearGradient(0, 0, size, 0);
  bgGrad.addColorStop(0, 'rgba(209,127,247,0.1)');
  bgGrad.addColorStop(1, 'rgba(157,214,252,0.1)');
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.arc(size/2, size/2, 240 * scale, 0, Math.PI * 2);
  ctx.fill();
  
  // Create gradient for letters
  const grad = ctx.createLinearGradient(0, 0, size, 0);
  grad.addColorStop(0, 'rgba(209,127,247,1)');
  grad.addColorStop(1, 'rgba(157,214,252,1)');
  ctx.fillStyle = grad;
  
  const radius = 8 * scale;
  
  // Helper for rounded rectangles
  const roundRect = (x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  };
  
  // Left T - horizontal bar
  roundRect(100 * scale, 150 * scale, 140 * scale, 40 * scale, radius);
  // Left T - vertical bar
  roundRect(150 * scale, 190 * scale, 40 * scale, 220 * scale, radius);
  
  // Right T - horizontal bar
  roundRect(272 * scale, 150 * scale, 140 * scale, 40 * scale, radius);
  // Right T - vertical bar
  roundRect(322 * scale, 190 * scale, 40 * scale, 220 * scale, radius);
  
  // Token count bars (decorative)
  ctx.globalAlpha = 0.7;
  roundRect(100 * scale, 440 * scale, 80 * scale, 8 * scale, 4 * scale);
  roundRect(190 * scale, 440 * scale, 120 * scale, 8 * scale, 4 * scale);
  roundRect(320 * scale, 440 * scale, 92 * scale, 8 * scale, 4 * scale);
  ctx.globalAlpha = 1.0;
}

// Generate logo in different sizes
const logoSizes = [32, 96, 128, 512];

logoSizes.forEach(size => {
  const canvas = createCanvas(size, size);
  drawLogo(canvas, size);
  
  const buffer = canvas.toBuffer('image/png');
  const filename = `logo-${size}.png`;
  const filepath = path.join(brandingDir, filename);
  
  fs.writeFileSync(filepath, buffer);
  console.log(`Generated: ${filename}`);
});

// Generate tokentally-512.png (same as logo-512)
const canvas512 = createCanvas(512, 512);
drawLogo(canvas512, 512);
const buffer512 = canvas512.toBuffer('image/png');
fs.writeFileSync(path.join(brandingDir, 'tokentally-512.png'), buffer512);
console.log('Generated: tokentally-512.png');

// Generate card banner (220x140)
const bannerCanvas = createCanvas(220, 140);
const bctx = bannerCanvas.getContext('2d');

// Gradient background
const bgrad = bctx.createLinearGradient(0, 0, 220, 0);
bgrad.addColorStop(0, 'rgba(209,127,247,1)');
bgrad.addColorStop(1, 'rgba(157,214,252,1)');
bctx.fillStyle = bgrad;
bctx.fillRect(0, 0, 220, 140);

// White text
bctx.fillStyle = 'white';
bctx.textAlign = 'center';
bctx.textBaseline = 'middle';

// Large TT
bctx.font = 'bold 48px Arial';
bctx.fillText('TT', 110, 55);

// TokenTally text
bctx.font = '16px Arial';
bctx.fillText('TokenTally', 110, 100);

const bannerBuffer = bannerCanvas.toBuffer('image/png');
fs.writeFileSync(path.join(brandingDir, 'card-banner-220x140.png'), bannerBuffer);
console.log('Generated: card-banner-220x140.png');

console.log('\nAll branding assets generated successfully!');
