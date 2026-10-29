const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { encodingForModel } = require('js-tiktoken');

const demoDirPath = path.join(__dirname, '..', 'demo', 'videos');
const tempDirPath = path.join(__dirname, '..', 'demo', 'temp');
const encoder = encodingForModel('gpt-4o');

function countTokens(text) {
  return encoder.encode(text).length;
}

// Demo 2: Selection and encoding switching with real counts
const demo2Text = "When comparing different large language models, it's important to consider their token limits and encoding schemes. GPT-4 uses the o200k_base encoding, while earlier models use cl100k_base.";
const demo2Selection = "it's important to consider their token limits and encoding schemes. GPT-4 uses the o200k_base encoding, while earlier models use cl100k_base.";

const demo2FullTokens = countTokens(demo2Text);
const demo2SelectionTokens = countTokens(demo2Selection);
const demo2SelectionCl100k = encodingForModel('gpt-4').encode(demo2Selection).length;
const demo2SelectionGemini = Math.round(demo2Selection.length * 0.22); // Estimate

console.log('Demo 2 counts:');
console.log('- Full text:', demo2FullTokens, 'tokens');
console.log('- Selection (o200k):', demo2SelectionTokens, 'tokens');
console.log('- Selection (cl100k):', demo2SelectionCl100k, 'tokens');
console.log('- Selection (gemini est):', demo2SelectionGemini, 'tokens');

const demo2HTML = `
<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Google Sans', 'Roboto', Arial, sans-serif; background: #e8eaed; height: 800px; overflow: hidden; }
.top-bar {
  background: #f9f9fa;
  height: 64px;
  border-bottom: 1px solid #dadce0;
  display: flex;
  align-items: center;
  padding: 0 16px;
}
.doc-icon {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  background: linear-gradient(135deg, #4285f4, #34a853);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 20px;
}
.doc-name { font-size: 18px; color: #202124; margin-right: auto; }
.menu-bar {
  background: #f9f9fa;
  height: 48px;
  border-bottom: 1px solid #dadce0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
}
.menu-item { font-size: 14px; color: #202124; padding: 6px 12px; border-radius: 4px; }
.toolbar {
  background: #f9f9fa;
  height: 56px;
  border-bottom: 1px solid #dadce0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 4px;
}
.toolbar-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: #444746; font-size: 18px; }
.content-area { display: flex; height: 632px; background: #e8eaed; }
.doc-canvas { flex: 1; padding: 40px; display: flex; justify-content: center; overflow-y: auto; }
.page { width: 700px; background: white; box-shadow: 0 1px 2px rgba(60,64,67,0.3); padding: 96px 80px; min-height: 400px; }
.page p { font-size: 14px; line-height: 1.6; margin-bottom: 12px; color: #3c4043; }
.selection { background: rgba(157,214,252,0); transition: background 0.3s; }
.selection.active { background: rgba(157,214,252,0.3); }
.sidebar { width: 320px; background: white; border-left: 1px solid #dadce0; overflow-y: auto; }
.gradient-header { background: linear-gradient(to right, #d17ff7, #9dd6fc); padding: 16px; color: white; text-align: center; }
.gradient-header h2 { font-size: 20px; margin: 0 0 4px 0; }
.gradient-header p { font-size: 12px; margin: 0; }
.sidebar-content { padding: 16px; }
.count-display { background: #f8f9fa; border: 1px solid #e8eaed; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 12px; }
.count-number { font-size: 36px; font-weight: 600; background: linear-gradient(to right, #d17ff7, #9dd6fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; transition: all 0.3s; }
.count-label { font-size: 12px; color: #5f6368; margin-top: 4px; }
.estimate-badge { display: inline-block; background: #fff3cd; color: #856404; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600; margin-left: 4px; }
.button { width: 100%; padding: 10px; background: linear-gradient(to right, #d17ff7, #9dd6fc); color: white; border: none; border-radius: 4px; font-size: 14px; font-weight: 500; margin-bottom: 16px; }
.section-title { font-size: 12px; font-weight: 600; color: #5f6368; text-transform: uppercase; margin: 16px 0 8px 0; }
select { width: 100%; padding: 10px; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px; margin-bottom: 12px; }
.heading-list { border: 1px solid #e8eaed; border-radius: 4px; background: #f8f9fa; max-height: 120px; overflow-y: auto; margin-bottom: 16px; }
.heading-item { padding: 10px 12px; border-bottom: 1px solid #e8eaed; display: flex; justify-content: space-between; }
.heading-item:last-child { border-bottom: none; }
.heading-text { flex: 1; font-size: 13px; margin-right: 12px; }
.heading-count { font-size: 12px; font-weight: 600; color: #5f6368; }
.promo-card { background: linear-gradient(to right, rgba(209,127,247,0.1), rgba(157,214,252,0.1)); border: 1px solid rgba(157,214,252,0.5); border-radius: 8px; padding: 12px; }
.promo-card h3 { font-size: 14px; margin-bottom: 6px; }
.promo-card p { font-size: 12px; color: #5f6368; margin-bottom: 8px; }
.promo-link { color: #d17ff7; text-decoration: none; font-size: 12px; font-weight: 500; }
</style></head><body>
<div class="top-bar">
  <div class="doc-icon">📄</div>
  <div class="doc-name">AI Model Comparison</div>
</div>
<div class="menu-bar">
  <div class="menu-item">File</div>
  <div class="menu-item">Edit</div>
  <div class="menu-item">View</div>
  <div class="menu-item">Insert</div>
  <div class="menu-item">Format</div>
  <div class="menu-item">Tools</div>
  <div class="menu-item">Extensions</div>
  <div class="menu-item">Help</div>
</div>
<div class="toolbar">
  <div class="toolbar-btn">↶</div>
  <div class="toolbar-btn">↷</div>
  <div class="toolbar-btn">🖨</div>
  <div class="toolbar-btn">B</div>
  <div class="toolbar-btn">I</div>
  <div class="toolbar-btn">U</div>
</div>
<div class="content-area">
<div class="doc-canvas"><div class="page">
<p>${demo2Text.replace(demo2Selection, `<span class="selection" id="sel">${demo2Selection}</span>`)}</p>
</div></div>
<div class="sidebar">
<div class="gradient-header"><h2>TokenTally</h2><p>LLM Token Counter</p></div>
<div class="sidebar-content">
<div class="count-display">
<div class="count-number" id="count">${demo2FullTokens}</div>
<div class="count-label" id="label">tokens (document)</div>
</div>
<button class="button">Refresh Count</button>
<div class="section-title">Encoding</div>
<select id="enc">
<option>GPT o200k_base</option>
<option>GPT cl100k_base</option>
<option>Gemini (estimate)</option>
</select>
<div class="section-title">Per-Heading Breakdown</div>
<div class="heading-list">
<div class="heading-item"><div class="heading-text">Document</div><div class="heading-count">${demo2FullTokens}</div></div>
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
{ delay: 1000, action: () => { 
  document.getElementById('sel').classList.add('active'); 
  document.getElementById('count').textContent = '${demo2SelectionTokens}'; 
  document.getElementById('label').textContent = 'tokens (selection)'; 
}},
{ delay: 3500, action: () => { 
  document.getElementById('enc').selectedIndex = 1; 
  document.getElementById('count').textContent = '${demo2SelectionCl100k}'; 
}},
{ delay: 6000, action: () => { 
  document.getElementById('enc').selectedIndex = 2; 
  document.getElementById('count').textContent = '${demo2SelectionGemini}'; 
  document.getElementById('label').innerHTML = 'tokens (selection) <span class="estimate-badge">ESTIMATE</span>'; 
}}
];
let i = 0;
function run() { if (i < steps.length) { setTimeout(() => { steps[i].action(); i++; run(); }, steps[i].delay); }}
window.onload = run;
</script></body></html>`;

// Demo 3: Budget bar with long realistic text and small budget (500 tokens)
const demo3Sections = {
  intro: "You are an AI assistant specialized in helping users with coding tasks. Your responses should be clear, concise, and technically accurate.",
  guidelines: "Always explain your reasoning. When writing code, use best practices and include comments. Consider edge cases and error handling.",
  examples: "For example, when implementing a function, first describe what it does, then show the implementation, and finally explain any non-obvious parts.",
  constraints: "Keep responses focused and relevant. If you're unsure about something, say so rather than making assumptions.",
};

const demo3Intro = countTokens(demo3Sections.intro);
const demo3Guidelines = countTokens(demo3Sections.guidelines);
const demo3Examples = countTokens(demo3Sections.examples);
const demo3Constraints = countTokens(demo3Sections.constraints);
const demo3Total = demo3Intro + demo3Guidelines + demo3Examples + demo3Constraints;

console.log('\nDemo 3 counts (500 token budget):');
console.log('- Introduction:', demo3Intro, 'tokens');
console.log('- Guidelines:', demo3Guidelines, 'tokens');
console.log('- Examples:', demo3Examples, 'tokens');
console.log('- Constraints:', demo3Constraints, 'tokens');
console.log('- TOTAL:', demo3Total, 'tokens (exceeds 500 budget)');

const demo3HTML = `
<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Google Sans', 'Roboto', Arial, sans-serif; background: #e8eaed; height: 800px; overflow: hidden; }
.top-bar {
  background: #f9f9fa;
  height: 64px;
  border-bottom: 1px solid #dadce0;
  display: flex;
  align-items: center;
  padding: 0 16px;
}
.doc-icon {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  background: linear-gradient(135deg, #4285f4, #34a853);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 20px;
}
.doc-name { font-size: 18px; color: #202124; margin-right: auto; }
.menu-bar {
  background: #f9f9fa;
  height: 48px;
  border-bottom: 1px solid #dadce0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
}
.menu-item { font-size: 14px; color: #202124; padding: 6px 12px; border-radius: 4px; }
.toolbar {
  background: #f9f9fa;
  height: 56px;
  border-bottom: 1px solid #dadce0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 4px;
}
.toolbar-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: #444746; font-size: 18px; }
.content-area { display: flex; height: 632px; background: #e8eaed; }
.doc-canvas { flex: 1; padding: 40px; display: flex; justify-content: center; overflow-y: auto; }
.page { width: 700px; background: white; box-shadow: 0 1px 2px rgba(60,64,67,0.3); padding: 96px 80px; min-height: 500px; }
.page h2 { font-size: 20px; font-weight: 500; margin: 20px 0 10px 0; color: #202124; }
.page p { font-size: 14px; line-height: 1.6; margin-bottom: 12px; color: #3c4043; }
.sidebar { width: 320px; background: white; border-left: 1px solid #dadce0; overflow-y: auto; }
.gradient-header { background: linear-gradient(to right, #d17ff7, #9dd6fc); padding: 16px; color: white; text-align: center; }
.gradient-header h2 { font-size: 20px; margin: 0 0 4px 0; }
.gradient-header p { font-size: 12px; margin: 0; }
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
.heading-list { border: 1px solid #e8eaed; border-radius: 4px; background: #f8f9fa; opacity: 0; transition: opacity 0.5s; max-height: 180px; overflow-y: auto; margin-bottom: 16px; }
.heading-list.visible { opacity: 1; }
.heading-item { padding: 10px 12px; border-bottom: 1px solid #e8eaed; display: flex; justify-content: space-between; }
.heading-item:last-child { border-bottom: none; }
.heading-text { flex: 1; font-size: 13px; margin-right: 12px; }
.heading-count { font-size: 12px; font-weight: 600; color: #5f6368; }
.promo-card { background: linear-gradient(to right, rgba(209,127,247,0.1), rgba(157,214,252,0.1)); border: 1px solid rgba(157,214,252,0.5); border-radius: 8px; padding: 12px; }
.promo-card h3 { font-size: 14px; margin-bottom: 6px; }
.promo-card p { font-size: 12px; color: #5f6368; margin-bottom: 8px; }
.promo-link { color: #d17ff7; text-decoration: none; font-size: 12px; font-weight: 500; }
</style></head><body>
<div class="top-bar">
  <div class="doc-icon">📄</div>
  <div class="doc-name">AI System Prompt</div>
</div>
<div class="menu-bar">
  <div class="menu-item">File</div>
  <div class="menu-item">Edit</div>
  <div class="menu-item">View</div>
  <div class="menu-item">Insert</div>
  <div class="menu-item">Format</div>
  <div class="menu-item">Tools</div>
  <div class="menu-item">Extensions</div>
  <div class="menu-item">Help</div>
</div>
<div class="toolbar">
  <div class="toolbar-btn">↶</div>
  <div class="toolbar-btn">↷</div>
  <div class="toolbar-btn">🖨</div>
  <div class="toolbar-btn">B</div>
  <div class="toolbar-btn">I</div>
  <div class="toolbar-btn">U</div>
</div>
<div class="content-area">
<div class="doc-canvas"><div class="page">
<h2>Introduction</h2>
<p>${demo3Sections.intro}</p>
<h2>Guidelines</h2>
<p>${demo3Sections.guidelines}</p>
<h2>Examples</h2>
<p>${demo3Sections.examples}</p>
<h2>Constraints</h2>
<p>${demo3Sections.constraints}</p>
</div></div>
<div class="sidebar">
<div class="gradient-header"><h2>TokenTally</h2><p>LLM Token Counter</p></div>
<div class="sidebar-content">
<div class="count-display">
<div class="count-number" id="count">${demo3Intro}</div>
<div class="count-label">tokens (document)</div>
<div class="budget-bar-container" id="budget">
<div class="budget-info"><span id="used">${demo3Intro}</span><span>500</span></div>
<div class="budget-bar"><div class="budget-fill" id="fill" style="width: ${Math.round((demo3Intro/500)*100)}%"></div></div>
</div>
</div>
<div class="section-title">Per-Heading Breakdown</div>
<div class="heading-list" id="headings">
<div class="heading-item"><div class="heading-text">Introduction</div><div class="heading-count">${demo3Intro}</div></div>
<div class="heading-item"><div class="heading-text">Guidelines</div><div class="heading-count">${demo3Guidelines}</div></div>
<div class="heading-item"><div class="heading-text">Examples</div><div class="heading-count">${demo3Examples}</div></div>
<div class="heading-item"><div class="heading-text">Constraints</div><div class="heading-count">${demo3Constraints}</div></div>
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
{ delay: 2500, action: () => { 
  const midTotal = ${demo3Intro + demo3Guidelines};
  document.getElementById('count').textContent = midTotal.toLocaleString(); 
  document.getElementById('used').textContent = midTotal.toLocaleString(); 
  document.getElementById('fill').style.width = Math.min(Math.round((midTotal/500)*100), 100) + '%'; 
  document.getElementById('fill').classList.add('warning'); 
}},
{ delay: 4500, action: () => { 
  const total = ${demo3Total};
  document.getElementById('count').textContent = total.toLocaleString(); 
  document.getElementById('used').textContent = total.toLocaleString(); 
  document.getElementById('fill').style.width = '100%'; 
  document.getElementById('fill').classList.remove('warning'); 
  document.getElementById('fill').classList.add('over'); 
}},
{ delay: 6500, action: () => document.getElementById('headings').classList.add('visible') }
];
let i = 0;
function run() { if (i < steps.length) { setTimeout(() => { steps[i].action(); i++; run(); }, steps[i].delay); }}
window.onload = run;
</script></body></html>`;

async function captureVideo(html, outputName, duration) {
  console.log(`\nGenerating ${outputName}...`);
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
  
  execSync(`ffmpeg -y -framerate ${fps} -i "${frameDir}/frame_%05d.png" -c:v libx264 -pix_fmt yuv420p -crf 23 "${path.join(demoDirPath, outputName)}.mp4"`, { stdio: 'pipe' });
  fs.rmSync(frameDir, { recursive: true });
  console.log(`✓ ${outputName}.mp4`);
}

(async () => {
  console.log('=== Regenerating videos 2 and 3 with fixes ===');
  await captureVideo(demo2HTML, 'demo-2-count', 16);
  await captureVideo(demo3HTML, 'demo-3-budget', 18);
  fs.rmSync(tempDirPath, { recursive: true, force: true });
  console.log('\n✓ Videos 2 and 3 regenerated with full Docs chrome and real token counts!');
})();
