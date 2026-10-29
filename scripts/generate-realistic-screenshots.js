const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { encodingForModel } = require('js-tiktoken');

const brandingDir = path.join(__dirname, '..', 'branding');
const encoder = encodingForModel('gpt-4o');

// Helper to count tokens
function countTokens(text) {
  return encoder.encode(text).length;
}

// Create realistic Google Docs mockup with sidebar
const createRealisticMockup = (scenario) => {
  const scenarios = {
    1: {
      title: 'Screenshot 1: Overview - Token counting in action',
      fileName: 'AI Prompt Engineering Guide',
      docContent: `<h1>AI Prompt Engineering Guide</h1>
<p>This comprehensive guide covers best practices for writing effective prompts for large language models.</p>
<h2>Introduction</h2>
<p>Prompt engineering is the art and science of crafting inputs that produce desired outputs from AI models. Understanding token limits is crucial for effective prompt design.</p>
<h2>Key Principles</h2>
<p>1. Be specific and clear in your instructions</p>
<p>2. Provide relevant context without exceeding token limits</p>
<p>3. Use examples to guide the model's behavior</p>`,
      encoding: 'GPT o200k_base',
      budgetVisible: true,
      budgetPercent: 35,
      isSelection: false
    },
    2: {
      title: 'Screenshot 2: Per-heading breakdown',
      fileName: 'Product Requirements Document',
      docContent: `<h1>Product Requirements Document</h1>
<p>Version 1.0 - Token-aware documentation system</p>
<h2>Overview</h2>
<p>Build a system that helps users track token usage across their documentation in real-time.</p>
<h3>Target Users</h3>
<p>Writers, developers, and AI practitioners who work with LLM context windows.</p>
<h2>Core Features</h2>
<p>Real-time token counting, multiple encoding support, budget tracking with visual indicators.</p>`,
      encoding: 'GPT cl100k_base',
      budgetVisible: true,
      budgetPercent: 18,
      isSelection: false
    },
    3: {
      title: 'Screenshot 3: Budget warning state',
      fileName: 'Research Paper Draft',
      docContent: `<h1>Understanding Large Language Models</h1>
<p>A comprehensive analysis of transformer architectures and their implications for natural language processing tasks.</p>
<h2>Abstract</h2>
<p>This paper examines the evolution of large language models from GPT-2 through GPT-4, analyzing their architectural improvements, training methodologies, and real-world applications across various domains including software development, content creation, and scientific research.</p>
<h2>Introduction</h2>
<p>The field of natural language processing has been revolutionized by the introduction of transformer-based architectures. These models have demonstrated unprecedented capabilities in understanding and generating human-like text.</p>
<h2>Methodology</h2>
<p>Our research combines quantitative analysis of model performance across standardized benchmarks with qualitative assessment of generated outputs.</p>`,
      encoding: 'Gemini (estimate)',
      budgetVisible: true,
      budgetPercent: 85,
      isSelection: false
    },
    4: {
      title: 'Screenshot 4: Over-budget with selection',
      fileName: 'Complete API Documentation',
      docContent: `<h1>API Documentation</h1>
<p>Complete reference for the TokenTally API and integration guide.</p>
<h2>Getting Started</h2>
<p>TokenTally provides a simple API for integrating token counting into your applications.</p>
<h2>Authentication</h2>
<p>All API requests require an API key passed in the Authorization header.</p>
<h2>Endpoints</h2>
<h3>Count Tokens</h3>
<p><span class="selection">POST /api/v1/count - Count tokens in provided text. Supports multiple encodings including GPT o200k_base, cl100k_base, and estimates for Gemini and Claude. Rate limited to 1000 requests per hour.</span></p>
<h3>Get Breakdown</h3>
<p>POST /api/v1/breakdown - Get per-heading token breakdown for structured documents.</p>`,
      encoding: 'Claude (estimate)',
      budgetVisible: true,
      budgetPercent: 100,
      isSelection: true,
      selectionText: 'POST /api/v1/count - Count tokens in provided text. Supports multiple encodings including GPT o200k_base, cl100k_base, and estimates for Gemini and Claude. Rate limited to 1000 requests per hour.'
    }
  };
  
  const config = scenarios[scenario];
  
  // Calculate real token counts
  const fullText = config.docContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const docTokens = countTokens(fullText);
  const selectionTokens = config.isSelection ? countTokens(config.selectionText) : 0;
  const displayTokens = config.isSelection ? selectionTokens : docTokens;
  const isEstimate = config.encoding.includes('estimate');
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Google Sans', 'Roboto', Arial, sans-serif;
      background: #e8eaed;
      height: 800px;
      overflow: hidden;
    }
    
    /* Google Docs top bar */
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
    .doc-name {
      font-size: 18px;
      color: #202124;
      margin-right: auto;
    }
    .top-bar-icons {
      display: flex;
      gap: 8px;
    }
    .icon-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #5f6368;
      font-size: 20px;
    }
    
    /* Menu bar */
    .menu-bar {
      background: #f9f9fa;
      height: 48px;
      border-bottom: 1px solid #dadce0;
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 12px;
    }
    .menu-item {
      font-size: 14px;
      color: #202124;
      padding: 6px 12px;
      cursor: pointer;
      border-radius: 4px;
    }
    
    /* Toolbar */
    .toolbar {
      background: #f9f9fa;
      height: 56px;
      border-bottom: 1px solid #dadce0;
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 4px;
    }
    .toolbar-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      color: #444746;
      font-size: 18px;
    }
    .toolbar-divider {
      width: 1px;
      height: 28px;
      background: #dadce0;
      margin: 0 4px;
    }
    
    /* Main content area */
    .content-area {
      display: flex;
      height: calc(800px - 168px);
      background: #e8eaed;
    }
    
    /* Document canvas */
    .doc-canvas {
      flex: 1;
      overflow-y: auto;
      padding: 40px 0;
      display: flex;
      justify-content: center;
    }
    .page {
      width: 700px;
      background: white;
      box-shadow: 0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
      padding: 96px 80px;
      min-height: 500px;
    }
    .page h1 {
      font-size: 24px;
      font-weight: 500;
      margin: 24px 0 12px 0;
      color: #202124;
    }
    .page h2 {
      font-size: 20px;
      font-weight: 500;
      margin: 20px 0 10px 0;
      color: #202124;
    }
    .page h3 {
      font-size: 16px;
      font-weight: 500;
      margin: 16px 0 8px 0;
      color: #202124;
    }
    .page p {
      font-size: 14px;
      line-height: 1.6;
      color: #3c4043;
      margin-bottom: 12px;
    }
    .selection {
      background: rgba(157,214,252,0.3);
    }
    
    /* Sidebar */
    .sidebar {
      width: 320px;
      background: white;
      border-left: 1px solid #dadce0;
      overflow-y: auto;
      flex-shrink: 0;
    }
    .gradient-header {
      background: linear-gradient(to right, rgba(209,127,247,1), rgba(157,214,252,1));
      padding: 16px;
      color: white;
      text-align: center;
    }
    .gradient-header h2 { font-size: 20px; margin: 0 0 4px 0; }
    .gradient-header p { font-size: 12px; margin: 0; }
    
    .sidebar-content { padding: 16px; }
    .count-display {
      background: #f8f9fa;
      border: 1px solid #e8eaed;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      margin-bottom: 12px;
    }
    .count-number {
      font-size: 36px;
      font-weight: 600;
      background: linear-gradient(to right, rgba(209,127,247,1), rgba(157,214,252,1));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 4px;
    }
    .count-label { font-size: 12px; color: #5f6368; }
    .estimate-badge {
      display: inline-block;
      background: #fff3cd;
      color: #856404;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 600;
      margin-left: 4px;
    }
    .budget-bar-container { margin-top: 12px; }
    .budget-info {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #5f6368;
      margin-bottom: 4px;
    }
    .budget-bar {
      height: 8px;
      background: #e8eaed;
      border-radius: 4px;
      overflow: hidden;
    }
    .budget-fill {
      height: 100%;
      background: linear-gradient(to right, rgba(209,127,247,1), rgba(157,214,252,1));
    }
    .budget-fill.warning { background: #f9ab00; }
    .budget-fill.over { background: #ea4335; }
    
    .button {
      width: 100%;
      padding: 10px;
      background: linear-gradient(to right, rgba(209,127,247,1), rgba(157,214,252,1));
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 16px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 600;
      color: #5f6368;
      text-transform: uppercase;
      margin: 16px 0 8px 0;
    }
    select {
      width: 100%;
      padding: 10px;
      border: 1px solid #dadce0;
      border-radius: 4px;
      font-size: 14px;
      margin-bottom: 12px;
    }
    .checkbox-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    .heading-list {
      border: 1px solid #e8eaed;
      border-radius: 4px;
      background: #f8f9fa;
      max-height: 200px;
      overflow-y: auto;
    }
    .heading-item {
      padding: 10px 12px;
      border-bottom: 1px solid #e8eaed;
      display: flex;
      justify-content: space-between;
    }
    .heading-item:last-child { border-bottom: none; }
    .heading-text { flex: 1; font-size: 13px; margin-right: 12px; }
    .heading-text.level-2 { padding-left: 16px; font-size: 12px; }
    .heading-text.level-3 { padding-left: 32px; font-size: 11px; }
    .heading-count { font-size: 12px; font-weight: 600; color: #5f6368; }
    
    .promo-card {
      background: linear-gradient(to right, rgba(209,127,247,0.1), rgba(157,214,252,0.1));
      border: 1px solid rgba(157,214,252,0.5);
      border-radius: 8px;
      padding: 12px;
      margin-top: 16px;
    }
    .promo-card h3 { font-size: 14px; margin-bottom: 6px; }
    .promo-card p { font-size: 12px; color: #5f6368; margin-bottom: 8px; }
    .promo-link {
      color: rgba(209,127,247,1);
      text-decoration: none;
      font-size: 12px;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <!-- Top bar -->
  <div class="top-bar">
    <div class="doc-icon">📄</div>
    <div class="doc-name">${config.fileName}</div>
    <div class="top-bar-icons">
      <div class="icon-btn">☆</div>
      <div class="icon-btn">👤</div>
    </div>
  </div>
  
  <!-- Menu bar -->
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
  
  <!-- Toolbar -->
  <div class="toolbar">
    <div class="toolbar-btn">↶</div>
    <div class="toolbar-btn">↷</div>
    <div class="toolbar-divider"></div>
    <div class="toolbar-btn">🖨</div>
    <div class="toolbar-divider"></div>
    <div class="toolbar-btn">B</div>
    <div class="toolbar-btn">I</div>
    <div class="toolbar-btn">U</div>
  </div>
  
  <!-- Main content area -->
  <div class="content-area">
    <div class="doc-canvas">
      <div class="page">
        ${config.docContent}
      </div>
    </div>
    
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="gradient-header">
        <h2>TokenTally</h2>
        <p>LLM Token Counter</p>
      </div>
      <div class="sidebar-content">
        <div class="count-display">
          <div class="count-number">${displayTokens.toLocaleString()}</div>
          <div class="count-label">
            tokens${config.isSelection ? ' (selection)' : ' (document)'}
            ${isEstimate ? '<span class="estimate-badge">ESTIMATE</span>' : ''}
          </div>
          ${config.budgetVisible ? `
          <div class="budget-bar-container">
            <div class="budget-info">
              <span>${displayTokens.toLocaleString()}</span>
              <span>8,000</span>
            </div>
            <div class="budget-bar">
              <div class="budget-fill ${config.budgetPercent >= 100 ? 'over' : config.budgetPercent >= 80 ? 'warning' : ''}" style="width: ${Math.min(config.budgetPercent, 100)}%"></div>
            </div>
          </div>
          ` : ''}
        </div>
        
        <button class="button">Refresh Count</button>
        
        <div class="section-title">Encoding</div>
        <select>
          <option ${config.encoding === 'GPT o200k_base' ? 'selected' : ''}>GPT o200k_base</option>
          <option ${config.encoding === 'GPT cl100k_base' ? 'selected' : ''}>GPT cl100k_base</option>
          <option ${config.encoding === 'Gemini (estimate)' ? 'selected' : ''}>Gemini (estimate)</option>
          <option ${config.encoding === 'Claude (estimate)' ? 'selected' : ''}>Claude (estimate)</option>
        </select>
        
        <div class="checkbox-wrapper">
          <input type="checkbox" ${config.budgetVisible ? 'checked' : ''}>
          <label>Show budget limit</label>
        </div>
        
        <div class="section-title">Per-Heading Breakdown</div>
        <div class="heading-list">
          <div class="heading-item">
            <div class="heading-text">Introduction</div>
            <div class="heading-count">245</div>
          </div>
          <div class="heading-item">
            <div class="heading-text">Main Section</div>
            <div class="heading-count">456</div>
          </div>
          <div class="heading-item">
            <div class="heading-text level-2">Subsection</div>
            <div class="heading-count">189</div>
          </div>
        </div>
        
        <!-- Drive I/O Promo -->
        <div class="promo-card">
          <h3>Copy Google Drive folders</h3>
          <p>Need to copy folders with permissions? Try Drive I/O!</p>
          <a href="#" class="promo-link">Learn more →</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

async function generateScreenshots() {
  console.log('Generating realistic Google Docs screenshots...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  for (let i = 1; i <= 4; i++) {
    console.log(`Generating screenshot ${i}...`);
    
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      
      const html = createRealisticMockup(i);
      await page.setContent(html, { 
        waitUntil: 'domcontentloaded',
        timeout: 10000
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filename = `screenshot-${i}.png`;
      const filepath = path.join(brandingDir, filename);
      
      await page.screenshot({
        path: filepath,
        type: 'png'
      });
      
      await page.close();
      
      console.log(`✓ Generated: ${filename}`);
    } catch (error) {
      console.error(`Error generating screenshot ${i}:`, error.message);
    }
  }
  
  await browser.close();
  console.log('\nAll screenshots generated successfully!');
}

generateScreenshots().catch(console.error);
