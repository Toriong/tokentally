const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { encodingForModel } = require('js-tiktoken');

const demoDirPath = path.join(__dirname, '..', 'demo', 'videos');
const tempDirPath = path.join(__dirname, '..', 'demo', 'temp');
const encoder = encodingForModel('gpt-4o');

const sections = {
  intro: 'You are an AI assistant specialized in helping users with software development tasks. Your primary role is to provide clear, accurate, and helpful responses to coding questions. You should explain concepts thoroughly while remaining concise. When writing code, always follow industry best practices and include appropriate comments.',
  guidelines: 'Always begin by understanding the user\'s requirements fully. Ask clarifying questions if needed. When providing solutions, explain your reasoning step by step. Consider edge cases, error handling, and performance implications. Use modern syntax and patterns appropriate for the language. Suggest improvements when you see opportunities to make code more maintainable or efficient.',
  examples: 'For example, when implementing a new feature, first outline the approach, then provide the implementation with clear comments explaining non-obvious parts. Show how to test the functionality and handle potential errors. When debugging, help identify the root cause by asking diagnostic questions and analyzing the symptoms systematically.',
  constraints: 'Keep responses focused on the specific question asked. If you\'re unsure about something, acknowledge the uncertainty rather than making assumptions. Prioritize security and data integrity in all recommendations. Stay up to date with current best practices and warn users about deprecated approaches or potential pitfalls.',
  formatting: 'Format code blocks with proper syntax highlighting. Use clear variable names and maintain consistent indentation. Break complex logic into smaller, well-named functions. Add type hints where applicable and document public interfaces thoroughly.',
  testing: 'Always consider testability when suggesting solutions. Recommend appropriate testing strategies for the context. Show how to write unit tests for the code you provide. Explain what aspects of the solution should be tested and why.'
};

const counts = {
  intro: encoder.encode(sections.intro).length,
  guidelines: encoder.encode(sections.guidelines).length,
  examples: encoder.encode(sections.examples).length,
  constraints: encoder.encode(sections.constraints).length,
  formatting: encoder.encode(sections.formatting).length,
  testing: encoder.encode(sections.testing).length
};

const total = Object.values(counts).reduce((a, b) => a + b, 0);
const budget = 200;
const firstSection = counts.intro;
const afterThree = counts.intro + counts.guidelines + counts.examples;

console.log('Demo 3 with 200 token budget:');
console.log('- Introduction:', counts.intro, 'tokens');
console.log('- Guidelines:', counts.guidelines, 'tokens');
console.log('- Examples:', counts.examples, 'tokens');
console.log('- Constraints:', counts.constraints, 'tokens');
console.log('- Formatting:', counts.formatting, 'tokens');
console.log('- Testing:', counts.testing, 'tokens');
console.log('- TOTAL:', total, 'tokens');
console.log('- Budget:', budget, 'tokens');
console.log('- Exceeds budget by:', total - budget, 'tokens');

const demo3HTML = `
<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Google Sans', 'Roboto', Arial, sans-serif; background: #e8eaed; height: 800px; overflow: hidden; }
.top-bar { background: #f9f9fa; height: 64px; border-bottom: 1px solid #dadce0; display: flex; align-items: center; padding: 0 16px; }
.doc-icon { width: 40px; height: 40px; margin-right: 12px; background: linear-gradient(135deg, #4285f4, #34a853); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px; }
.doc-name { font-size: 18px; color: #202124; margin-right: auto; }
.menu-bar { background: #f9f9fa; height: 48px; border-bottom: 1px solid #dadce0; display: flex; align-items: center; padding: 0 16px; gap: 12px; }
.menu-item { font-size: 14px; color: #202124; padding: 6px 12px; border-radius: 4px; }
.toolbar { background: #f9f9fa; height: 56px; border-bottom: 1px solid #dadce0; display: flex; align-items: center; padding: 0 16px; gap: 4px; }
.toolbar-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: #444746; font-size: 18px; }
.content-area { display: flex; height: 632px; background: #e8eaed; }
.doc-canvas { flex: 1; padding: 40px; display: flex; justify-content: center; overflow-y: auto; }
.page { width: 700px; background: white; box-shadow: 0 1px 2px rgba(60,64,67,0.3); padding: 96px 80px; min-height: 600px; }
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
.heading-list { border: 1px solid #e8eaed; border-radius: 4px; background: #f8f9fa; opacity: 0; transition: opacity 0.5s; max-height: 150px; overflow-y: auto; margin-bottom: 16px; }
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
<p>${sections.intro}</p>
<h2>Guidelines</h2>
<p>${sections.guidelines}</p>
<h2>Examples</h2>
<p>${sections.examples}</p>
<h2>Constraints</h2>
<p>${sections.constraints}</p>
<h2>Formatting</h2>
<p>${sections.formatting}</p>
<h2>Testing</h2>
<p>${sections.testing}</p>
</div></div>
<div class="sidebar">
<div class="gradient-header"><h2>TokenTally</h2><p>LLM Token Counter</p></div>
<div class="sidebar-content">
<div class="count-display">
<div class="count-number" id="count">${firstSection}</div>
<div class="count-label">tokens (document)</div>
<div class="budget-bar-container" id="budget">
<div class="budget-info"><span id="used">${firstSection}</span><span>${budget}</span></div>
<div class="budget-bar"><div class="budget-fill" id="fill" style="width: ${Math.min(Math.round((firstSection/budget)*100), 100)}%"></div></div>
</div>
</div>
<div class="section-title">Per-Heading Breakdown</div>
<div class="heading-list" id="headings">
<div class="heading-item"><div class="heading-text">Introduction</div><div class="heading-count">${counts.intro}</div></div>
<div class="heading-item"><div class="heading-text">Guidelines</div><div class="heading-count">${counts.guidelines}</div></div>
<div class="heading-item"><div class="heading-text">Examples</div><div class="heading-count">${counts.examples}</div></div>
<div class="heading-item"><div class="heading-text">Constraints</div><div class="heading-count">${counts.constraints}</div></div>
<div class="heading-item"><div class="heading-text">Formatting</div><div class="heading-count">${counts.formatting}</div></div>
<div class="heading-item"><div class="heading-text">Testing</div><div class="heading-count">${counts.testing}</div></div>
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
  document.getElementById('count').textContent = '${afterThree}'; 
  document.getElementById('used').textContent = '${afterThree}'; 
  document.getElementById('fill').style.width = '100%'; 
  document.getElementById('fill').classList.add('warning'); 
}},
{ delay: 5000, action: () => { 
  document.getElementById('count').textContent = '${total}'; 
  document.getElementById('used').textContent = '${total}'; 
  document.getElementById('fill').classList.remove('warning'); 
  document.getElementById('fill').classList.add('over'); 
}},
{ delay: 7000, action: () => document.getElementById('headings').classList.add('visible') }
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
  await captureVideo(demo3HTML, 'demo-3-budget', 18);
  fs.rmSync(tempDirPath, { recursive: true, force: true });
  console.log('✓ Demo 3 regenerated with 200 token budget and real counts!');
})();
