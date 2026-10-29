const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const brandingDir = path.join(__dirname, '..', 'branding');

// Ensure branding directory exists
if (!fs.existsSync(brandingDir)) {
  fs.mkdirSync(brandingDir, { recursive: true });
}

// Create realistic mockup HTML for screenshots
const createMockupHTML = (scenario) => {
  const scenarios = {
    1: {
      title: 'Overview - Token counting in action',
      docTitle: 'AI Prompt Engineering Guide',
      docContent: `
        <h1>AI Prompt Engineering Guide</h1>
        <p>This comprehensive guide covers best practices for writing effective prompts for large language models.</p>
        <h2>Introduction</h2>
        <p>Prompt engineering is the art and science of crafting inputs that produce desired outputs from AI models. Understanding token limits is crucial for effective prompt design.</p>
        <h2>Key Principles</h2>
        <p>1. Be specific and clear in your instructions</p>
        <p>2. Provide relevant context without exceeding token limits</p>
        <p>3. Use examples to guide the model's behavior</p>
        <h2>Token Management</h2>
        <p>Different models have different context windows. GPT-4 supports up to 128K tokens, while GPT-3.5 supports 16K tokens. Managing your token usage effectively ensures your prompts fit within these limits.</p>
      `,
      sidebarState: 'main',
      tokenCount: '2,847',
      budgetVisible: true,
      budgetPercent: 35,
      encoding: 'o200k_base'
    },
    2: {
      title: 'Per-heading breakdown view',
      docTitle: 'Product Requirements Document',
      docContent: `
        <h1>Product Requirements Document</h1>
        <p>Version 1.0 - Token-aware documentation system</p>
        <h2>Overview</h2>
        <p>Build a system that helps users track token usage across their documentation in real-time, with per-section breakdowns and budget management.</p>
        <h3>Target Users</h3>
        <p>Writers, developers, and AI practitioners who work with LLM context windows.</p>
        <h2>Core Features</h2>
        <p>Real-time token counting, multiple encoding support, budget tracking with visual indicators.</p>
        <h3>Technical Requirements</h3>
        <p>Must support GPT encodings with exact counts using js-tiktoken library. Estimates acceptable for other models.</p>
        <h2>Success Metrics</h2>
        <p>User adoption, accuracy of token counts, performance under large documents.</p>
      `,
      sidebarState: 'breakdown',
      tokenCount: '1,456',
      budgetVisible: true,
      budgetPercent: 18,
      encoding: 'cl100k_base'
    },
    3: {
      title: 'Budget warning state',
      docTitle: 'Research Paper: Large Language Models',
      docContent: `
        <h1>Understanding Large Language Models</h1>
        <p>A comprehensive analysis of transformer architectures and their implications for natural language processing tasks.</p>
        <h2>Abstract</h2>
        <p>This paper examines the evolution of large language models from GPT-2 through GPT-4, analyzing their architectural improvements, training methodologies, and real-world applications across various domains including software development, content creation, and scientific research.</p>
        <h2>Introduction</h2>
        <p>The field of natural language processing has been revolutionized by the introduction of transformer-based architectures. These models have demonstrated unprecedented capabilities in understanding and generating human-like text, opening new possibilities for human-computer interaction.</p>
        <h2>Methodology</h2>
        <p>Our research combines quantitative analysis of model performance across standardized benchmarks with qualitative assessment of generated outputs. We evaluate models on tasks including question answering, summarization, code generation, and creative writing.</p>
        <h3>Data Collection</h3>
        <p>We utilized publicly available datasets and conducted original experiments across multiple model families.</p>
      `,
      sidebarState: 'warning',
      tokenCount: '6,840',
      budgetVisible: true,
      budgetPercent: 85,
      encoding: 'gemini'
    },
    4: {
      title: 'Over-budget state with selection',
      docTitle: 'Complete API Documentation',
      docContent: `
        <h1>API Documentation</h1>
        <p>Complete reference for the TokenTally API and integration guide.</p>
        <h2>Getting Started</h2>
        <p>TokenTally provides a simple API for integrating token counting into your applications. This section covers installation, authentication, and basic usage patterns.</p>
        <h2>Authentication</h2>
        <p>All API requests require an API key passed in the Authorization header. Keys can be generated from your dashboard.</p>
        <h2>Endpoints</h2>
        <h3>Count Tokens</h3>
        <p><span class="selection">POST /api/v1/count - Count tokens in provided text. Supports multiple encodings including GPT o200k_base, cl100k_base, and estimates for Gemini and Claude. Rate limited to 1000 requests per hour.</span></p>
        <h3>Get Breakdown</h3>
        <p>POST /api/v1/breakdown - Get per-heading token breakdown for structured documents. Automatically detects heading levels and calculates tokens for each section.</p>
        <h2>Error Handling</h2>
        <p>The API uses standard HTTP status codes. Rate limit errors return 429. Invalid requests return 400 with detailed error messages.</p>
        <h2>Best Practices</h2>
        <p>Cache token counts when possible. Use batch endpoints for multiple documents. Monitor your usage to avoid rate limits.</p>
      `,
      sidebarState: 'over',
      tokenCount: '8,924',
      budgetVisible: true,
      budgetPercent: 100,
      encoding: 'claude',
      hasSelection: true,
      selectionTokens: '167'
    }
  };
  
  const config = scenarios[scenario];
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Google Sans', 'Roboto', Arial, sans-serif;
      background: #f8f9fa;
      display: flex;
      height: 800px;
      overflow: hidden;
    }
    .doc-area {
      flex: 1;
      background: white;
      padding: 96px 80px;
      overflow-y: auto;
    }
    .doc-title {
      font-size: 28px;
      font-weight: 400;
      color: #202124;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 24px;
      font-weight: 500;
      margin: 24px 0 12px 0;
      color: #202124;
    }
    h2 {
      font-size: 20px;
      font-weight: 500;
      margin: 20px 0 10px 0;
      color: #202124;
    }
    h3 {
      font-size: 16px;
      font-weight: 500;
      margin: 16px 0 8px 0;
      color: #202124;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
      color: #3c4043;
      margin-bottom: 12px;
    }
    .selection {
      background: rgba(157,214,252,0.3);
      padding: 2px 0;
    }
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
    .gradient-header h2 {
      font-size: 20px;
      font-weight: 500;
      margin: 0 0 4px 0;
      color: white;
    }
    .gradient-header p {
      font-size: 12px;
      opacity: 0.95;
      color: white;
      margin: 0;
    }
    .sidebar-content {
      padding: 16px;
    }
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
      background-clip: text;
      margin-bottom: 4px;
    }
    .count-label {
      font-size: 12px;
      color: #5f6368;
    }
    .estimate-badge {
      display: inline-block;
      background: #fff3cd;
      color: #856404;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 600;
      margin-left: 4px;
      text-transform: uppercase;
    }
    .budget-bar-container {
      margin-top: 12px;
    }
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
      transition: width 0.3s ease;
    }
    .budget-fill.warning {
      background: #f9ab00;
    }
    .budget-fill.over {
      background: #ea4335;
    }
    .button {
      width: 100%;
      padding: 10px;
      background: linear-gradient(to right, rgba(209,127,247,1), rgba(157,214,252,1));
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      margin-bottom: 16px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 600;
      color: #5f6368;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 16px 0 8px 0;
    }
    .select-wrapper {
      position: relative;
      margin-bottom: 12px;
    }
    select {
      width: 100%;
      padding: 10px 32px 10px 12px;
      border: 1px solid #dadce0;
      border-radius: 4px;
      font-size: 14px;
      background: white;
      cursor: pointer;
      appearance: none;
    }
    .select-wrapper::after {
      content: '▼';
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 10px;
      color: #5f6368;
      pointer-events: none;
    }
    .heading-list {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid #e8eaed;
      border-radius: 4px;
      background: #f8f9fa;
    }
    .heading-item {
      padding: 10px 12px;
      border-bottom: 1px solid #e8eaed;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .heading-item:last-child {
      border-bottom: none;
    }
    .heading-text {
      flex: 1;
      font-size: 13px;
      color: #202124;
      margin-right: 12px;
    }
    .heading-text.level-2 {
      padding-left: 16px;
      font-size: 12px;
    }
    .heading-text.level-3 {
      padding-left: 32px;
      font-size: 11px;
    }
    .heading-count {
      font-size: 12px;
      font-weight: 600;
      color: #5f6368;
      white-space: nowrap;
    }
    .checkbox-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
  </style>
</head>
<body>
  <div class="doc-area">
    <div class="doc-title">${config.docTitle}</div>
    ${config.docContent}
  </div>
  <div class="sidebar">
    <div class="gradient-header">
      <h2>TokenTally</h2>
      <p>LLM Token Counter</p>
    </div>
    <div class="sidebar-content">
      <div class="count-display">
        <div class="count-number">${config.hasSelection ? config.selectionTokens : config.tokenCount}</div>
        <div class="count-label">
          tokens${config.hasSelection ? ' (selection)' : ' (document)'}
          ${config.encoding === 'gemini' || config.encoding === 'claude' ? '<span class="estimate-badge">estimate</span>' : ''}
        </div>
        ${config.budgetVisible ? `
        <div class="budget-bar-container">
          <div class="budget-info">
            <span>${config.hasSelection ? config.selectionTokens : config.tokenCount}</span>
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
      <div class="select-wrapper">
        <select>
          <option ${config.encoding === 'o200k_base' ? 'selected' : ''}>GPT o200k_base</option>
          <option ${config.encoding === 'cl100k_base' ? 'selected' : ''}>GPT cl100k_base</option>
          <option ${config.encoding === 'gemini' ? 'selected' : ''}>Gemini (estimate)</option>
          <option ${config.encoding === 'claude' ? 'selected' : ''}>Claude (estimate)</option>
        </select>
      </div>
      
      <div class="checkbox-wrapper">
        <input type="checkbox" ${config.budgetVisible ? 'checked' : ''}>
        <label>Show budget limit</label>
      </div>
      
      <div class="section-title">Per-Heading Breakdown</div>
      <div class="heading-list">
        <div class="heading-item">
          <div class="heading-text">${config.docTitle.split(':')[0] || config.docTitle}</div>
          <div class="heading-count">892</div>
        </div>
        <div class="heading-item">
          <div class="heading-text level-2">Introduction</div>
          <div class="heading-count">456</div>
        </div>
        <div class="heading-item">
          <div class="heading-text level-2">Main Section</div>
          <div class="heading-count">1,234</div>
        </div>
        <div class="heading-item">
          <div class="heading-text level-3">Subsection A</div>
          <div class="heading-count">678</div>
        </div>
        <div class="heading-item">
          <div class="heading-text level-2">Conclusion</div>
          <div class="heading-count">321</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

async function generateScreenshots() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  for (let i = 1; i <= 4; i++) {
    console.log(`Generating screenshot ${i}...`);
    
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      
      const html = createMockupHTML(i);
      await page.setContent(html, { 
        waitUntil: 'domcontentloaded',
        timeout: 10000
      });
      
      // Wait a bit for rendering
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filename = `screenshot-${i}.png`;
      const filepath = path.join(brandingDir, filename);
      
      await page.screenshot({
        path: filepath,
        type: 'png'
      });
      
      await page.close();
      
      console.log(`Generated: ${filename}`);
    } catch (error) {
      console.error(`Error generating screenshot ${i}:`, error.message);
    }
  }
  
  await browser.close();
  console.log('\nAll screenshots generated successfully!');
}

generateScreenshots().catch(console.error);
