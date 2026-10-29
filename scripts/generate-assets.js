/**
 * Script to generate branding assets for TokenTally
 * Creates PNG logos and screenshots using HTML canvas
 */

const fs = require('fs');
const path = require('path');

// Create a simple HTML file that will render and export assets
const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: 'Google Sans', Arial, sans-serif;
    }
    canvas {
      border: 1px solid #ddd;
      margin: 10px;
    }
  </style>
</head>
<body>
  <h2>TokenTally Asset Generator</h2>
  <p>Open this file in a browser with canvas support to generate assets.</p>
  
  <div id="canvases"></div>
  
  <script>
    const gradient = (ctx, x, y, w, h) => {
      const grad = ctx.createLinearGradient(x, y, x + w, y);
      grad.addColorStop(0, 'rgba(209,127,247,1)');
      grad.addColorStop(1, 'rgba(157,214,252,1)');
      return grad;
    };
    
    const drawLogo = (canvas, size) => {
      const ctx = canvas.getContext('2d');
      canvas.width = size;
      canvas.height = size;
      
      // Clear
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, size, size);
      
      const scale = size / 512;
      
      // Background circle
      ctx.fillStyle = gradient(ctx, 0, 0, size, size);
      ctx.globalAlpha = 0.1;
      ctx.beginPath();
      ctx.arc(size/2, size/2, 240 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      
      // T letters
      ctx.fillStyle = gradient(ctx, 0, 0, size, size);
      ctx.roundRect = (x, y, w, h, r) => {
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
      
      // Left T
      ctx.roundRect(100 * scale, 150 * scale, 140 * scale, 40 * scale, 8 * scale);
      ctx.roundRect(150 * scale, 190 * scale, 40 * scale, 220 * scale, 8 * scale);
      
      // Right T
      ctx.roundRect(272 * scale, 150 * scale, 140 * scale, 40 * scale, 8 * scale);
      ctx.roundRect(322 * scale, 190 * scale, 40 * scale, 220 * scale, 8 * scale);
      
      // Token bars
      ctx.globalAlpha = 0.7;
      ctx.roundRect(100 * scale, 440 * scale, 80 * scale, 8 * scale, 4 * scale);
      ctx.roundRect(190 * scale, 440 * scale, 120 * scale, 8 * scale, 4 * scale);
      ctx.roundRect(320 * scale, 440 * scale, 92 * scale, 8 * scale, 4 * scale);
      ctx.globalAlpha = 1;
    };
    
    // Generate logos
    const sizes = [32, 96, 128, 512];
    const container = document.getElementById('canvases');
    
    sizes.forEach(size => {
      const canvas = document.createElement('canvas');
      canvas.id = 'logo-' + size;
      drawLogo(canvas, size);
      
      const div = document.createElement('div');
      div.innerHTML = '<h3>Logo ' + size + 'x' + size + '</h3>';
      div.appendChild(canvas);
      
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'logo-' + size + '.png';
      link.textContent = 'Download';
      link.style.display = 'block';
      link.style.marginTop = '5px';
      div.appendChild(link);
      
      container.appendChild(div);
    });
    
    // Card banner (220x140)
    const bannerCanvas = document.createElement('canvas');
    bannerCanvas.width = 220;
    bannerCanvas.height = 140;
    const bctx = bannerCanvas.getContext('2d');
    
    // Gradient background
    const bgrad = bctx.createLinearGradient(0, 0, 220, 0);
    bgrad.addColorStop(0, 'rgba(209,127,247,1)');
    bgrad.addColorStop(1, 'rgba(157,214,252,1)');
    bctx.fillStyle = bgrad;
    bctx.fillRect(0, 0, 220, 140);
    
    // Text
    bctx.fillStyle = 'white';
    bctx.font = 'bold 32px Arial';
    bctx.textAlign = 'center';
    bctx.fillText('TT', 110, 80);
    bctx.font = '14px Arial';
    bctx.fillText('TokenTally', 110, 105);
    
    const bannerDiv = document.createElement('div');
    bannerDiv.innerHTML = '<h3>Card Banner 220x140</h3>';
    bannerDiv.appendChild(bannerCanvas);
    const bannerLink = document.createElement('a');
    bannerLink.href = bannerCanvas.toDataURL('image/png');
    bannerLink.download = 'card-banner-220x140.png';
    bannerLink.textContent = 'Download';
    bannerLink.style.display = 'block';
    bannerLink.style.marginTop = '5px';
    bannerDiv.appendChild(bannerLink);
    container.appendChild(bannerDiv);
    
    console.log('Assets generated. Right-click and save each canvas as PNG.');
  </script>
</body>
</html>
`;

// Write the HTML generator
const outputPath = path.join(__dirname, '..', 'branding', 'generate-assets.html');
fs.writeFileSync(outputPath, htmlTemplate);

console.log('Asset generator created at:', outputPath);
console.log('Open this file in a browser to generate and download PNG assets.');
