const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const demoDirPath = path.join(__dirname, '..', 'demo', 'videos');
const tempDirPath = path.join(__dirname, '..', 'demo', 'temp');

const demo2HTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Google Sans', Arial, sans-serif; background: #e8eaed; height: 800px; overflow: hidden; }
.top-bar { background: #f9f9fa; height: 64px; border-bottom: 1px solid #dadce0; padding: 0 16px; display: flex; align-items: center; }
.doc-name { font-size: 18px; color: #202124; margin-left: 48px; }
.menu-bar { background: #f9f9fa; height: 48px; border-bottom: 1px solid #dadce0; }
.toolbar { background: #f9f9fa; height: 56px; border-bottom: 1px solid #dadce0; }
.content-area { display: flex; height: 632px; background: #e8eaed; }
.doc-canvas { flex: 1; padding: 40px; display: flex; justify-content: center; }
.page { width: 700px; background: white; box-shadow: 0 1px 2px rgba(0,0,0,0.3); padding: 80px; }
.page p { font-size: 14px; line-height: 1.6; margin-bottom: 12px; }
.selection { background: rgba(157,214,252,0); transition: background 0.3s; }
.selection.active { background: rgba(157,214,252,0.3); }
.sidebar { width: 320px; background: white; border-left: 1px solid #dadce0; overflow-y: auto; }
.gradient-header { background: linear-gradient(to right, #d17ff7, #9dd6fc); padding: 16px; color: white; text-align: center; }
.gradient-header h2 { font-size: 20px; margin: 0 0 4px 0; }
.sidebar-content { padding: 16px; }
.count-display { background: #f8f9fa; border: 1px solid #e8eaed; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 12px; }
.count-number { font-size: 36px; font-weight: 600; background: linear-gradient(to right, #d17ff7, #9dd6fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; transition: all 0.3s; }
.count-label { font-size: 12px; color: #5f6368; margin-top: 4px; }
.button { width: 100%; padding: 10px; background: linear-gradient(to right, #d17ff7, #9dd6fc); color: white; border: none; border-radius: 4px; font-size: 14px; margin-bottom: 16px; }
select { width: 100%; padding: 10px; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px; margin: 8px 0; }
.section-title { font-size: 12px; font-weight: 600; color: #5f6368; text-transform: uppercase; margin: 16px 0 8px 0; }
</style></head><body>
<div class="top-bar"><div class="doc-name">AI Model Comparison</div></div>
<div class="menu-bar"></div><div class="toolbar"></div>
<div class="content-area">
<div class="doc-canvas"><div class="page">
<p>When comparing models, <span class="selection" id="sel">it's important to consider their token limits and encoding schemes. GPT-4 uses the o200k_base encoding.</span></p>
</div></div>
<div class="sidebar">
<div class="gradient-header"><h2>TokenTally</h2><p>LLM Token Counter</p></div>
<div class="sidebar-content">
<div class="count-display">
<div class="count-number" id="count">123</div>
<div class="count-label" id="label">tokens (document)</div>
</div>
<button class="button">Refresh Count</button>
<div class="section-title">Encoding</div>
<select id="enc">
<option>GPT o200k_base</option>
<option>GPT cl100k_base</option>
<option>Gemini (estimate)</option>
</select>
</div></div>
</div>
<script>
const steps = [
{ delay: 1000, action: () => { document.getElementById('sel').classList.add('active'); document.getElementById('count').textContent = '26'; document.getElementById('label').textContent = 'tokens (selection)'; }},
{ delay: 3000, action: () => { document.getElementById('enc').selectedIndex = 1; document.getElementById('count').textContent = '25'; }},
{ delay: 5000, action: () => { document.getElementById('enc').selectedIndex = 2; document.getElementById('count').textContent = '24'; document.getElementById('label').innerHTML = 'tokens (selection) <span style="background:#fff3cd;color:#856404;padding:2px 6px;border-radius:3px;font-size:10px;margin-left:4px;">ESTIMATE</span>'; }}
];
let i = 0;
function run() { if (i < steps.length) { setTimeout(() => { steps[i].action(); i++; run(); }, steps[i].delay); }}
window.onload = run;
</script></body></html>`;

const demo3HTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Google Sans', Arial, sans-serif; background: #e8eaed; height: 800px; overflow: hidden; }
.top-bar { background: #f9f9fa; height: 64px; border-bottom: 1px solid #dadce0; padding: 0 16px; display: flex; align-items: center; }
.doc-name { font-size: 18px; color: #202124; margin-left: 48px; }
.menu-bar { background: #f9f9fa; height: 48px; border-bottom: 1px solid #dadce0; }
.toolbar { background: #f9f9fa; height: 56px; border-bottom: 1px solid #dadce0; }
.content-area { display: flex; height: 632px; background: #e8eaed; }
.doc-canvas { flex: 1; padding: 40px; display: flex; justify-content: center; }
.page { width: 700px; background: white; box-shadow: 0 1px 2px rgba(0,0,0,0.3); padding: 80px; }
.page h2 { font-size: 20px; margin: 20px 0 10px 0; }
.page p { font-size: 14px; line-height: 1.6; margin-bottom: 12px; }
.sidebar { width: 320px; background: white; border-left: 1px solid #dadce0; overflow-y: auto; }
.gradient-header { background: linear-gradient(to right, #d17ff7, #9dd6fc); padding: 16px; color: white; text-align: center; }
.gradient-header h2 { font-size: 20px; margin: 0 0 4px 0; }
.sidebar-content { padding: 16px; }
.count-display { background: #f8f9fa; border: 1px solid #e8eaed; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 12px; }
.count-number { font-size: 36px; font-weight: 600; background: linear-gradient(to right, #d17ff7, #9dd6fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; transition: all 0.3s; }
.count-label { font-size: 12px; color: #5f6368; margin-top: 4px; }
.budget-bar-container { margin-top: 12px; opacity: 0; transition: opacity 0.3s; }
.budget-bar-container.visible { opacity: 1; }
.budget-info { display: flex; justify-content: space-between; font-size: 11px; color: #5f6368; margin-bottom: 4px; }
.budget-bar { height: 8px; background: #e8eaed; border-radius: 4px; overflow: hidden; }
.budget-fill { height: 100%; background: linear-gradient(to right, #d17ff7, #9dd6fc); transition: all 0.5s; }
.budget-fill.warning { background: #f9ab00; }
.budget-fill.over { background: #ea4335; }
.section-title { font-size: 12px; font-weight: 600; color: #5f6368; text-transform: uppercase; margin: 16px 0 8px 0; }
.heading-list { border: 1px solid #e8eaed; border-radius: 4px; background: #f8f9fa; opacity: 0; transition: opacity 0.5s; max-height: 150px; overflow-y: auto; }
.heading-list.visible { opacity: 1; }
.heading-item { padding: 10px 12px; border-bottom: 1px solid #e8eaed; display: flex; justify-content: space-between; }
.heading-text { flex: 1; font-size: 13px; }
.heading-count { font-size: 12px; font-weight: 600; color: #5f6368; }
.promo-card { background: linear-gradient(to right, rgba(209,127,247,0.1), rgba(157,214,252,0.1)); border: 1px solid rgba(157,214,252,0.5); border-radius: 8px; padding: 12px; margin-top: 16px; }
.promo-card h3 { font-size: 14px; margin-bottom: 6px; }
.promo-card p { font-size: 12px; color: #5f6368; margin-bottom: 8px; }
.promo-link { color: #d17ff7; text-decoration: none; font-size: 12px; font-weight: 500; }
</style></head><body>
<div class="top-bar"><div class="doc-name">Research Paper</div></div>
<div class="menu-bar"></div><div class="toolbar"></div>
<div class="content-area">
<div class="doc-canvas"><div class="page">
<h2>Introduction</h2>
<p>This research paper explores language models...</p>
<h2>Methodology</h2>
<p>Our approach combines analysis...</p>
</div></div>
<div class="sidebar">
<div class="gradient-header"><h2>TokenTally</h2><p>LLM Token Counter</p></div>
<div class="sidebar-content">
<div class="count-display">
<div class="count-number" id="count">4200</div>
<div class="count-label">tokens (document)</div>
<div class="budget-bar-container" id="budget">
<div class="budget-info"><span id="used">4200</span><span>8,000</span></div>
<div class="budget-bar"><div class="budget-fill" id="fill" style="width: 52%"></div></div>
</div>
</div>
<div class="section-title">Per-Heading Breakdown</div>
<div class="heading-list" id="headings">
<div class="heading-item"><div class="heading-text">Introduction</div><div class="heading-count">1,456</div></div>
<div class="heading-item"><div class="heading-text">Methodology</div><div class="heading-count">1,234</div></div>
<div class="heading-item"><div class="heading-text">Results</div><div class="heading-count">1,510</div></div>
</div>
<div class="promo-card">
<h3>Copy Google Drive folders</h3>
<p>Need to copy folders? Try Drive I/O!</p>
<a href="#" class="promo-link">Learn more →</a>
</div>
</div></div>
</div>
<script>
const steps = [
{ delay: 1000, action: () => document.getElementById('budget').classList.add('visible') },
{ delay: 3000, action: () => { document.getElementById('count').textContent = '7200'; document.getElementById('used').textContent = '7200'; document.getElementById('fill').style.width = '90%'; document.getElementById('fill').classList.add('warning'); }},
{ delay: 5500, action: () => { document.getElementById('count').textContent = '8824'; document.getElementById('used').textContent = '8824'; document.getElementById('fill').style.width = '100%'; document.getElementById('fill').classList.remove('warning'); document.getElementById('fill').classList.add('over'); }},
{ delay: 7500, action: () => document.getElementById('headings').classList.add('visible') }
];
let i = 0;
function run() { if (i < steps.length) { setTimeout(() => { steps[i].action(); i++; run(); }, steps[i].delay); }}
window.onload = run;
</script></body></html>`;

async function captureVideo(html, outputName, duration) {
  console.log(`Generating ${outputName}...`);
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setContent(html);
  
  const frameDir = path.join(tempDirPath, outputName);
  fs.mkdirSync(frameDir, { recursive: true });
  
  const fps = 10;
  for (let i = 0; i < duration * fps; i++) {
    await page.screenshot({ path: path.join(frameDir, `frame_${String(i).padStart(5, '0')}.png`) });
    await new Promise(r => setTimeout(r, 1000 / fps));
    if (i % 20 === 0) process.stdout.write('.');
  }
  console.log();
  await browser.close();
  
  execSync(`ffmpeg -y -framerate ${fps} -i "${frameDir}/frame_%05d.png" -c:v libx264 -pix_fmt yuv420p -crf 23 "${path.join(demoDirPath, outputName)}.mp4"`, { stdio: 'inherit' });
  fs.rmSync(frameDir, { recursive: true });
  console.log(`✓ ${outputName}.mp4`);
}

(async () => {
  await captureVideo(demo2HTML, 'demo-2-count', 16);
  await captureVideo(demo3HTML, 'demo-3-budget', 18);
  fs.rmSync(tempDirPath, { recursive: true, force: true });
  console.log('All videos complete!');
})();
