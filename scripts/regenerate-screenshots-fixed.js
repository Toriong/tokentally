const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { encodingForModel } = require('js-tiktoken');

const brandingDir = path.join(__dirname, '..', 'branding');
const encoder = encodingForModel('gpt-4o');

function countTokens(text) {
  return encoder.encode(text).length;
}

// Screenshot 1: AI Prompt Engineering Guide - Normal budget (under 80%)
const s1_intro = "This comprehensive guide covers best practices for writing effective prompts for large language models.";
const s1_intro_section = "Prompt engineering is the art and science of crafting inputs that produce desired outputs from AI models. Understanding token limits is crucial for effective prompt design.";
const s1_principles = "1. Be specific and clear in your instructions\n2. Provide relevant context without exceeding token limits\n3. Use examples to guide the model's behavior";

const s1_intro_tokens = countTokens(s1_intro_section);
const s1_principles_tokens = countTokens(s1_principles);
const s1_total = s1_intro_tokens + s1_principles_tokens;
const s1_budget = 200; // Normal state

console.log('Screenshot 1 (Normal):');
console.log('- Introduction:', s1_intro_tokens, 'tokens');
console.log('- Key Principles:', s1_principles_tokens, 'tokens');
console.log('- Total:', s1_total, 'tokens');
console.log('- Budget:', s1_budget, 'tokens');
console.log('- Percentage:', Math.round((s1_total/s1_budget)*100) + '%');

// Screenshot 2: Product Requirements - Warning state (80-99%)
const s2_overview = "Build a system that helps users track token usage across their documentation in real-time, with per-section breakdowns and budget management.";
const s2_users = "Writers, developers, and AI practitioners who work with LLM context windows.";
const s2_features = "Real-time token counting, multiple encoding support, budget tracking with visual indicators.";

const s2_overview_tokens = countTokens(s2_overview);
const s2_users_tokens = countTokens(s2_users);
const s2_features_tokens = countTokens(s2_features);
const s2_total = s2_overview_tokens + s2_users_tokens + s2_features_tokens;
const s2_budget = 60; // Warning state

console.log('\nScreenshot 2 (Warning):');
console.log('- Overview:', s2_overview_tokens, 'tokens');
console.log('- Target Users:', s2_users_tokens, 'tokens');
console.log('- Core Features:', s2_features_tokens, 'tokens');
console.log('- Total:', s2_total, 'tokens');
console.log('- Budget:', s2_budget, 'tokens');
console.log('- Percentage:', Math.round((s2_total/s2_budget)*100) + '%');

// Screenshot 3: Research Paper - Over budget (100%+)
const s3_abstract = "This paper examines the evolution of large language models from GPT-2 through GPT-4, analyzing their architectural improvements, training methodologies, and real-world applications across various domains including software development, content creation, and scientific research.";
const s3_intro = "The field of natural language processing has been revolutionized by the introduction of transformer-based architectures. These models have demonstrated unprecedented capabilities in understanding and generating human-like text.";
const s3_method = "Our research combines quantitative analysis of model performance across standardized benchmarks with qualitative assessment of generated outputs.";

const s3_abstract_tokens = countTokens(s3_abstract);
const s3_intro_tokens = countTokens(s3_intro);
const s3_method_tokens = countTokens(s3_method);
const s3_total = s3_abstract_tokens + s3_intro_tokens + s3_method_tokens;
const s3_budget = 100; // Over budget

console.log('\nScreenshot 3 (Over):');
console.log('- Abstract:', s3_abstract_tokens, 'tokens');
console.log('- Introduction:', s3_intro_tokens, 'tokens');
console.log('- Methodology:', s3_method_tokens, 'tokens');
console.log('- Total:', s3_total, 'tokens');
console.log('- Budget:', s3_budget, 'tokens');
console.log('- Percentage:', Math.round((s3_total/s3_budget)*100) + '%');

// Screenshot 4: API Documentation with selection - Normal state
const s4_getting_started = "TokenTally provides a simple API for integrating token counting into your applications. This section covers installation, authentication, and basic usage patterns.";
const s4_auth = "All API requests require an API key passed in the Authorization header. Keys can be generated from your dashboard.";
const s4_endpoints = "POST /api/v1/count - Count tokens in provided text. Supports multiple encodings including GPT o200k_base, cl100k_base, and estimates for Gemini and Claude. Rate limited to 1000 requests per hour.";

const s4_getting_started_tokens = countTokens(s4_getting_started);
const s4_auth_tokens = countTokens(s4_auth);
const s4_endpoints_tokens = countTokens(s4_endpoints);
const s4_selection_tokens = countTokens(s4_endpoints);
const s4_total = s4_getting_started_tokens + s4_auth_tokens + s4_endpoints_tokens;
const s4_budget = 150; // Normal state

console.log('\nScreenshot 4 (Selection):');
console.log('- Getting Started:', s4_getting_started_tokens, 'tokens');
console.log('- Authentication:', s4_auth_tokens, 'tokens');
console.log('- Endpoints:', s4_endpoints_tokens, 'tokens');
console.log('- Selection:', s4_selection_tokens, 'tokens');
console.log('- Total:', s4_total, 'tokens');
console.log('- Budget:', s4_budget, 'tokens');
console.log('- Percentage:', Math.round((s4_total/s4_budget)*100) + '%');

const createScreenshot = (config) => {
  const {
    num,
    fileName,
    docContent,
    headings,
    totalTokens,
    displayTokens,
    budget,
    isSelection,
    encoding,
    isEstimate
  } = config;
  
  const percent = Math.round((displayTokens / budget) * 100);
  const fillPercent = Math.min(percent, 100);
  const fillClass = percent >= 100 ? 'over' : percent >= 80 ? 'warning' : '';
  
  return `
<!DOCTYPE html>
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
.page h3 { font-size: 16px; font-weight: 500; margin: 16px 0 8px 0; color: #202124; }
.page p { font-size: 14px; line-height: 1.6; color: #3c4043; margin-bottom: 12px; }
.selection { background: rgba(157,214,252,0.3); }
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
.budget-fill { height: 100%; background: linear-gradient(to right, #d17ff7, #9dd6fc); }
.budget-fill.warning { background: #f9ab00; }
.budget-fill.over { background: #ea4335; }
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
.heading-text.level-2 { padding-left: 16px; font-size: 12px; }
.heading-text.level-3 { padding-left: 32px; font-size: 11px; }
.heading-count { font-size: 12px; font-weight: 600; color: #5f6368; white-space: nowrap; }
.promo-card { background: linear-gradient(to right, rgba(209,127,247,0.1), rgba(157,214,252,0.1)); border: 1px solid rgba(157,214,252,0.5); border-radius: 8px; padding: 12px; }
.promo-card h3 { font-size: 14px; margin-bottom: 6px; color: #202124; }
.promo-card p { font-size: 12px; color: #5f6368; margin-bottom: 8px; line-height: 1.4; }
.promo-link { color: #d17ff7; text-decoration: none; font-size: 12px; font-weight: 500; }
</style></head><body>
<div class="top-bar">
  <div class="doc-icon">📄</div>
  <div class="doc-name">${fileName}</div>
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
  <div class="doc-canvas"><div class="page">${docContent}</div></div>
  <div class="sidebar">
    <div class="gradient-header">
      <h2>TokenTally</h2>
      <p>LLM Token Counter</p>
    </div>
    <div class="sidebar-content">
      <div class="count-display">
        <div class="count-number">${displayTokens.toLocaleString()}</div>
        <div class="count-label">
          tokens${isSelection ? ' (selection)' : ' (document)'}
          ${isEstimate ? '<span class="estimate-badge">ESTIMATE</span>' : ''}
        </div>
        <div class="budget-bar-container">
          <div class="budget-info">
            <span>${displayTokens.toLocaleString()}</span>
            <span>${budget.toLocaleString()}</span>
          </div>
          <div class="budget-bar">
            <div class="budget-fill ${fillClass}" style="width: ${fillPercent}%"></div>
          </div>
        </div>
      </div>
      <button class="button">Refresh Count</button>
      <div class="section-title">Encoding</div>
      <div class="select-wrapper">
        <select>
          <option ${encoding === 'o200k' ? 'selected' : ''}>GPT o200k_base</option>
          <option ${encoding === 'cl100k' ? 'selected' : ''}>GPT cl100k_base</option>
          <option ${encoding === 'gemini' ? 'selected' : ''}>Gemini (estimate)</option>
          <option ${encoding === 'claude' ? 'selected' : ''}>Claude (estimate)</option>
        </select>
      </div>
      <div class="checkbox-wrapper">
        <input type="checkbox" checked>
        <label>Show budget limit</label>
      </div>
      <div class="section-title">Per-Heading Breakdown</div>
      <div class="heading-list">
        ${headings.map(h => `
          <div class="heading-item">
            <div class="heading-text${h.level > 1 ? ' level-' + h.level : ''}">${h.text}</div>
            <div class="heading-count">${h.tokens.toLocaleString()}</div>
          </div>
        `).join('')}
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
};

const screenshots = [
  {
    num: 1,
    fileName: 'AI Prompt Engineering Guide',
    docContent: `
      <h1>AI Prompt Engineering Guide</h1>
      <p>${s1_intro}</p>
      <h2>Introduction</h2>
      <p>${s1_intro_section}</p>
      <h2>Key Principles</h2>
      <p>${s1_principles}</p>
    `,
    headings: [
      { text: 'Introduction', level: 2, tokens: s1_intro_tokens },
      { text: 'Key Principles', level: 2, tokens: s1_principles_tokens }
    ],
    totalTokens: s1_total,
    displayTokens: s1_total,
    budget: s1_budget,
    isSelection: false,
    encoding: 'o200k',
    isEstimate: false
  },
  {
    num: 2,
    fileName: 'Product Requirements Document',
    docContent: `
      <h1>Product Requirements Document</h1>
      <p>Version 1.0 - Token-aware documentation system</p>
      <h2>Overview</h2>
      <p>${s2_overview}</p>
      <h3>Target Users</h3>
      <p>${s2_users}</p>
      <h2>Core Features</h2>
      <p>${s2_features}</p>
    `,
    headings: [
      { text: 'Overview', level: 2, tokens: s2_overview_tokens },
      { text: 'Target Users', level: 3, tokens: s2_users_tokens },
      { text: 'Core Features', level: 2, tokens: s2_features_tokens }
    ],
    totalTokens: s2_total,
    displayTokens: s2_total,
    budget: s2_budget,
    isSelection: false,
    encoding: 'cl100k',
    isEstimate: false
  },
  {
    num: 3,
    fileName: 'Research Paper Draft',
    docContent: `
      <h1>Understanding Large Language Models</h1>
      <p>A comprehensive analysis of transformer architectures and their implications.</p>
      <h2>Abstract</h2>
      <p>${s3_abstract}</p>
      <h2>Introduction</h2>
      <p>${s3_intro}</p>
      <h2>Methodology</h2>
      <p>${s3_method}</p>
    `,
    headings: [
      { text: 'Abstract', level: 2, tokens: s3_abstract_tokens },
      { text: 'Introduction', level: 2, tokens: s3_intro_tokens },
      { text: 'Methodology', level: 2, tokens: s3_method_tokens }
    ],
    totalTokens: s3_total,
    displayTokens: s3_total,
    budget: s3_budget,
    isSelection: false,
    encoding: 'gemini',
    isEstimate: true
  },
  {
    num: 4,
    fileName: 'Complete API Documentation',
    docContent: `
      <h1>API Documentation</h1>
      <p>Complete reference for the TokenTally API and integration guide.</p>
      <h2>Getting Started</h2>
      <p>${s4_getting_started}</p>
      <h2>Authentication</h2>
      <p>${s4_auth}</p>
      <h2>Endpoints</h2>
      <h3>Count Tokens</h3>
      <p><span class="selection">${s4_endpoints}</span></p>
    `,
    headings: [
      { text: 'Getting Started', level: 2, tokens: s4_getting_started_tokens },
      { text: 'Authentication', level: 2, tokens: s4_auth_tokens },
      { text: 'Endpoints', level: 2, tokens: s4_endpoints_tokens }
    ],
    totalTokens: s4_total,
    displayTokens: s4_selection_tokens,
    budget: s4_budget,
    isSelection: true,
    encoding: 'claude',
    isEstimate: true
  }
];

async function generateScreenshots() {
  console.log('\n=== Regenerating all 4 screenshots with real counts ===\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  for (const config of screenshots) {
    console.log(`Generating screenshot ${config.num}...`);
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    const html = createScreenshot(config);
    await page.setContent(html, { 
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const filename = `screenshot-${config.num}.png`;
    const filepath = path.join(brandingDir, filename);
    
    await page.screenshot({
      path: filepath,
      type: 'png'
    });
    
    await page.close();
    
    console.log(`✓ Generated: ${filename}`);
  }
  
  await browser.close();
  console.log('\n✓ All screenshots regenerated with accurate counts and budgets!');
}

generateScreenshots().catch(console.error);
