const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const brandingDir = path.join(__dirname, '..', 'branding');

const s3_abstract = 'This paper examines the evolution of large language models from GPT-2 through GPT-4, analyzing their architectural improvements, training methodologies, and real-world applications across various domains including software development, content creation, and scientific research. We explore how these advances impact practical applications and future research directions.';
const s3_intro = 'The field of natural language processing has been revolutionized by the introduction of transformer-based architectures. These models have demonstrated unprecedented capabilities in understanding and generating human-like text, opening new possibilities for human-computer interaction.';
const s3_method = 'Our research combines quantitative analysis of model performance across standardized benchmarks with qualitative assessment of generated outputs. We evaluate multiple model architectures and training approaches.';

const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Google Sans', 'Roboto', Arial, sans-serif; background: #e8eaed; height: 800px; overflow: hidden; }
.top-bar { background: #f9f9fa; height: 64px; border-bottom: 1px solid #dadce0; display: flex; align-items: center; padding: 0 16px; }
.doc-icon { width: 40px; height: 40px; margin-right: 12px; background: linear-gradient(135deg, #4285f4, #34a853); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px; }
.doc-name { font-size: 18px; color: #202124; margin-right: auto; }
.menu-bar { background: #f9f9fa; height: 48px; border-bottom: 1px solid #dadce0; display: flex; align-items: center; padding: 0 16px; gap: 12px; }
.menu-item { font-size: 14px; color: #202124; padding: 6px 12px; }
.toolbar { background: #f9f9fa; height: 56px; border-bottom: 1px solid #dadce0; display: flex; align-items: center; padding: 0 16px; gap: 4px; }
.toolbar-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: #444746; font-size: 18px; }
.content-area { display: flex; height: 632px; background: #e8eaed; }
.doc-canvas { flex: 1; padding: 40px; display: flex; justify-content: center; overflow-y: auto; }
.page { width: 700px; background: white; box-shadow: 0 1px 2px rgba(60,64,67,0.3); padding: 96px 80px; min-height: 400px; }
.page h1 { font-size: 24px; font-weight: 500; margin: 24px 0 12px 0; color: #202124; }
.page h2 { font-size: 20px; font-weight: 500; margin: 20px 0 10px 0; color: #202124; }
.page p { font-size: 14px; line-height: 1.6; color: #3c4043; margin-bottom: 12px; }
.sidebar { width: 320px; background: white; border-left: 1px solid #dadce0; overflow-y: auto; }
.gradient-header { background: linear-gradient(to right, #d17ff7, #9dd6fc); padding: 16px; color: white; text-align: center; }
.gradient-header h2 { font-size: 20px; margin: 0 0 4px 0; }
.gradient-header p { font-size: 12px; margin: 0; }
.sidebar-content { padding: 16px; }
.count-display { background: #f8f9fa; border: 1px solid #e8eaed; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 12px; }
.count-number { font-size: 36px; font-weight: 600; background: linear-gradient(to right, #d17ff7, #9dd6fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.count-label { font-size: 12px; color: #5f6368; margin-top: 4px; }
.estimate-badge { display: inline-block; background: #fff3cd; color: #856404; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600; margin-left: 4px; }
.budget-bar-container { margin-top: 12px; }
.budget-info { display: flex; justify-content: space-between; font-size: 11px; color: #5f6368; margin-bottom: 4px; }
.budget-bar { height: 8px; background: #e8eaed; border-radius: 4px; overflow: hidden; }
.budget-fill { height: 100%; background: #ea4335; }
.button { width: 100%; padding: 10px; background: linear-gradient(to right, #d17ff7, #9dd6fc); color: white; border: none; border-radius: 4px; font-size: 14px; font-weight: 500; margin-bottom: 16px; }
.section-title { font-size: 12px; font-weight: 600; color: #5f6368; text-transform: uppercase; margin: 16px 0 8px 0; }
.select-wrapper { position: relative; margin-bottom: 12px; }
select { width: 100%; padding: 10px 32px 10px 12px; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px; background: white; appearance: none; }
.select-wrapper::after { content: '▼'; position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 10px; color: #5f6368; pointer-events: none; }
.checkbox-wrapper { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.heading-list { border: 1px solid #e8eaed; border-radius: 4px; background: #f8f9fa; max-height: 200px; overflow-y: auto; margin-bottom: 16px; }
.heading-item { padding: 10px 12px; border-bottom: 1px solid #e8eaed; display: flex; justify-content: space-between; }
.heading-item:last-child { border-bottom: none; }
.heading-text { flex: 1; font-size: 13px; margin-right: 12px; color: #202124; }
.heading-count { font-size: 12px; font-weight: 600; color: #5f6368; white-space: nowrap; }
.promo-card { background: linear-gradient(to right, rgba(209,127,247,0.1), rgba(157,214,252,0.1)); border: 1px solid rgba(157,214,252,0.5); border-radius: 8px; padding: 12px; }
.promo-card h3 { font-size: 14px; margin-bottom: 6px; color: #202124; }
.promo-card p { font-size: 12px; color: #5f6368; margin-bottom: 8px; line-height: 1.4; }
.promo-link { color: #d17ff7; text-decoration: none; font-size: 12px; font-weight: 500; }
</style></head><body>
<div class="top-bar">
  <div class="doc-icon">📄</div>
  <div class="doc-name">Research Paper Draft</div>
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
    <h1>Understanding Large Language Models</h1>
    <p>A comprehensive analysis of transformer architectures and their implications.</p>
    <h2>Abstract</h2>
    <p>${s3_abstract}</p>
    <h2>Introduction</h2>
    <p>${s3_intro}</p>
    <h2>Methodology</h2>
    <p>${s3_method}</p>
  </div></div>
  <div class="sidebar">
    <div class="gradient-header">
      <h2>TokenTally</h2>
      <p>LLM Token Counter</p>
    </div>
    <div class="sidebar-content">
      <div class="count-display">
        <div class="count-number">125</div>
        <div class="count-label">
          tokens (document)
          <span class="estimate-badge">ESTIMATE</span>
        </div>
        <div class="budget-bar-container">
          <div class="budget-info">
            <span>125</span>
            <span>100</span>
          </div>
          <div class="budget-bar">
            <div class="budget-fill" style="width: 100%"></div>
          </div>
        </div>
      </div>
      <button class="button">Refresh Count</button>
      <div class="section-title">Encoding</div>
      <div class="select-wrapper">
        <select>
          <option>GPT o200k_base</option>
          <option>GPT cl100k_base</option>
          <option selected>Gemini (estimate)</option>
          <option>Claude (estimate)</option>
        </select>
      </div>
      <div class="checkbox-wrapper">
        <input type="checkbox" checked>
        <label>Show budget limit</label>
      </div>
      <div class="section-title">Per-Heading Breakdown</div>
      <div class="heading-list">
        <div class="heading-item">
          <div class="heading-text">Abstract</div>
          <div class="heading-count">57</div>
        </div>
        <div class="heading-item">
          <div class="heading-text">Introduction</div>
          <div class="heading-count">41</div>
        </div>
        <div class="heading-item">
          <div class="heading-text">Methodology</div>
          <div class="heading-count">27</div>
        </div>
      </div>
      <div class="promo-card">
        <h3>Copy Google Drive folders</h3>
        <p>Need to copy folders with permissions? Try Drive I/O!</p>
        <a href="#" class="promo-link">Learn more →</a>
      </div>
    </div>
  </div>
</div>
</body></html>`;

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setContent(html);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(brandingDir, 'screenshot-3.png'), type: 'png' });
  await browser.close();
  console.log('✓ Screenshot 3 regenerated: 125/100 tokens (over budget, red bar)');
})();
