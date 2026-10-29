const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

async function bundleTokenizer() {
  console.log('Bundling tokenizer...');
  
  // Bundle tokenizer.ts into a single JS file
  const result = await esbuild.build({
    entryPoints: ['src/tokenizer.ts'],
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: 'es2019',
    write: false,
    minify: true
  });
  
  const bundledCode = result.outputFiles[0].text;
  
  // Read the Sidebar.html template
  const sidebarPath = path.join(__dirname, '..', 'src', 'Sidebar.html');
  let html = fs.readFileSync(sidebarPath, 'utf8');
  
  // Replace the placeholder with the bundled tokenizer
  html = html.replace(
    '// TOKENIZER_BUNDLE_PLACEHOLDER - Will be replaced with bundled js-tiktoken',
    `// Bundled js-tiktoken for exact GPT tokenization\n    ${bundledCode}`
  );
  
  // Write to build directory
  const buildDir = path.join(__dirname, '..', 'build');
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }
  
  const outputPath = path.join(buildDir, 'Sidebar.html');
  fs.writeFileSync(outputPath, html, 'utf8');
  
  console.log(`✓ Tokenizer bundled and inlined into build/Sidebar.html (${Math.round(bundledCode.length / 1024)}KB)`);
}

bundleTokenizer().catch(console.error);
