const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const demoDirPath = path.join(__dirname, '..', 'demo', 'videos');
const tempDirPath = path.join(__dirname, '..', 'demo', 'temp');

// Ensure directories exist
if (!fs.existsSync(demoDirPath)) {
  fs.mkdirSync(demoDirPath, { recursive: true });
}
if (!fs.existsSync(tempDirPath)) {
  fs.mkdirSync(tempDirPath, { recursive: true });
}

// Demo 1: Opening TokenTally and onboarding
const demo1HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
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
      position: relative;
    }
    .doc-title { font-size: 28px; margin-bottom: 20px; }
    h1 { font-size: 24px; margin: 16px 0; }
    p { font-size: 14px; line-height: 1.6; margin-bottom: 12px; }
    
    .menu-overlay {
      position: absolute;
      top: 16px;
      left: 16px;
      background: white;
      border: 1px solid #dadce0;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      padding: 8px 0;
      min-width: 200px;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .menu-overlay.visible { opacity: 1; }
    .menu-item {
      padding: 10px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .menu-item:hover { background: #f8f9fa; }
    .menu-item.highlighted { background: rgba(157,214,252,0.2); }
    
    .sidebar {
      width: 320px;
      background: white;
      border-left: 1px solid #dadce0;
      overflow-y: auto;
      transform: translateX(100%);
      transition: transform 0.3s;
    }
    .sidebar.visible { transform: translateX(0); }
    
    .gradient-header {
      background: linear-gradient(to right, rgba(209,127,247,1), rgba(157,214,252,1));
      padding: 16px;
      color: white;
      text-align: center;
    }
    .gradient-header h2 { font-size: 20px; margin: 0 0 4px 0; }
    .gradient-header p { font-size: 12px; margin: 0; }
    
    .onboarding {
      padding: 20px;
      opacity: 0;
      transition: opacity 0.5s;
    }
    .onboarding.visible { opacity: 1; }
    .onboarding-logo-text {
      font-size: 32px;
      font-weight: 600;
      background: linear-gradient(to right, rgba(209,127,247,1), rgba(157,214,252,1));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-align: center;
      margin-bottom: 20px;
    }
    .onboarding h2 { font-size: 18px; margin-bottom: 12px; }
    .onboarding p { font-size: 14px; margin-bottom: 12px; }
    .onboarding ul { margin: 12px 0; padding-left: 20px; }
    .onboarding li { margin-bottom: 8px; }
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
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="doc-area">
    <div class="doc-title">My AI Prompt</div>
    <h1>Introduction</h1>
    <p>This document contains an important prompt for an AI model. I need to make sure it fits within the token limit.</p>
    <div class="menu-overlay" id="menu">
      <div class="menu-item">Add-ons</div>
      <div class="menu-item">Help</div>
      <div class="menu-item" style="border-top: 1px solid #dadce0; padding-top: 8px; margin-top: 8px;">Extensions ▸</div>
      <div class="menu-item highlighted" id="tokentally-menu" style="padding-left: 32px;">TokenTally ▸</div>
      <div class="menu-item" id="open-item" style="padding-left: 48px; display: none;">Open</div>
    </div>
  </div>
  <div class="sidebar" id="sidebar">
    <div class="gradient-header">
      <h2>TokenTally</h2>
      <p>LLM Token Counter</p>
    </div>
    <div class="onboarding" id="onboarding">
      <div class="onboarding-logo-text">TokenTally</div>
      <h2>Welcome to TokenTally! 🎉</h2>
      <p>Your personal LLM token counter for Google Docs.</p>
      <p><strong>What you can do:</strong></p>
      <ul>
        <li>Count tokens in your document</li>
        <li>See per-heading breakdowns</li>
        <li>Set token budgets</li>
        <li>Track usage in real-time</li>
      </ul>
      <button class="button">Get Started</button>
    </div>
  </div>
  <script>
    const steps = [
      { delay: 1000, action: () => document.getElementById('menu').classList.add('visible') },
      { delay: 2000, action: () => {
        document.getElementById('tokentally-menu').style.background = 'rgba(157,214,252,0.3)';
        document.getElementById('open-item').style.display = 'block';
      }},
      { delay: 3000, action: () => {
        document.getElementById('sidebar').classList.add('visible');
        document.getElementById('menu').classList.remove('visible');
      }},
      { delay: 4000, action: () => document.getElementById('onboarding').classList.add('visible') }
    ];
    
    let stepIndex = 0;
    function runStep() {
      if (stepIndex < steps.length) {
        setTimeout(() => {
          steps[stepIndex].action();
          stepIndex++;
          runStep();
        }, steps[stepIndex].delay);
      }
    }
    window.onload = () => runStep();
  </script>
</body>
</html>
`;

// Demo 2: Counting and encoding selection
const demo2HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
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
    }
    .doc-title { font-size: 28px; margin-bottom: 20px; }
    p { font-size: 14px; line-height: 1.6; margin-bottom: 12px; }
    .selection {
      background: rgba(157,214,252,0);
      transition: background 0.3s;
    }
    .selection.highlighted {
      background: rgba(157,214,252,0.3);
    }
    .sidebar {
      width: 320px;
      background: white;
      border-left: 1px solid #dadce0;
      overflow-y: auto;
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
      transition: all 0.3s;
    }
    .count-label { font-size: 12px; color: #5f6368; }
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
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  <div class="doc-area">
    <div class="doc-title">AI Model Comparison</div>
    <p>When comparing different large language models, <span class="selection" id="selectionText">it's important to consider their token limits and encoding schemes. GPT-4 uses the o200k_base encoding, while earlier models use cl100k_base.</span></p>
    <p>Understanding these differences helps in optimizing prompts for each model.</p>
  </div>
  <div class="sidebar">
    <div class="gradient-header">
      <h2>TokenTally</h2>
      <p>LLM Token Counter</p>
    </div>
    <div class="sidebar-content">
      <div class="count-display">
        <div class="count-number" id="tokenCount">1,847</div>
        <div class="count-label" id="countLabel">tokens (document)</div>
      </div>
      <button class="button">Refresh Count</button>
      <div class="section-title">Encoding</div>
      <select id="encoding">
        <option>GPT o200k_base</option>
        <option>GPT cl100k_base</option>
        <option>Gemini (estimate)</option>
        <option>Claude (estimate)</option>
      </select>
    </div>
  </div>
  <script>
    const steps = [
      { delay: 1000, action: () => {
        document.getElementById('selectionText').classList.add('highlighted');
        document.getElementById('tokenCount').textContent = '42';
        document.getElementById('countLabel').textContent = 'tokens (selection)';
      }},
      { delay: 3000, action: () => {
        document.getElementById('encoding').selectedIndex = 1;
        document.getElementById('tokenCount').textContent = '41';
      }},
      { delay: 5000, action: () => {
        document.getElementById('encoding').selectedIndex = 2;
        document.getElementById('tokenCount').textContent = '38';
        document.getElementById('countLabel').innerHTML = 'tokens (selection) <span style="background:#fff3cd;color:#856404;padding:2px 6px;border-radius:3px;font-size:10px;margin-left:4px;">ESTIMATE</span>';
      }}
    ];
    
    let stepIndex = 0;
    function runStep() {
      if (stepIndex < steps.length) {
        setTimeout(() => {
          steps[stepIndex].action();
          stepIndex++;
          runStep();
        }, steps[stepIndex].delay);
      }
    }
    window.onload = () => runStep();
  </script>
</body>
</html>
`;

// Demo 3: Budget bar and breakdown
const demo3HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
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
    }
    .doc-title { font-size: 28px; margin-bottom: 20px; }
    h2 { font-size: 20px; margin: 16px 0 8px 0; }
    p { font-size: 14px; line-height: 1.6; margin-bottom: 12px; }
    .sidebar {
      width: 320px;
      background: white;
      border-left: 1px solid #dadce0;
      overflow-y: auto;
    }
    .gradient-header {
      background: linear-gradient(to right, rgba(209,127,247,1), rgba(157,214,252,1));
      padding: 16px;
      color: white;
      text-align: center;
    }
    .gradient-header h2 { font-size: 20px; margin: 0 0 4px 0; color: white; }
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
      transition: all 0.3s;
    }
    .count-label { font-size: 12px; color: #5f6368; }
    .budget-bar-container {
      margin-top: 12px;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .budget-bar-container.visible { opacity: 1; }
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
      transition: all 0.5s;
    }
    .budget-fill.warning { background: #f9ab00; }
    .budget-fill.over { background: #ea4335; }
    .section-title {
      font-size: 12px;
      font-weight: 600;
      color: #5f6368;
      text-transform: uppercase;
      margin: 16px 0 8px 0;
    }
    .heading-list {
      border: 1px solid #e8eaed;
      border-radius: 4px;
      background: #f8f9fa;
      opacity: 0;
      transition: opacity 0.5s;
    }
    .heading-list.visible { opacity: 1; }
    .heading-item {
      padding: 10px 12px;
      border-bottom: 1px solid #e8eaed;
      display: flex;
      justify-content: space-between;
    }
    .heading-item:last-child { border-bottom: none; }
    .heading-text {
      flex: 1;
      font-size: 13px;
      margin-right: 12px;
    }
    .heading-text.level-2 { padding-left: 16px; font-size: 12px; }
    .heading-count {
      font-size: 12px;
      font-weight: 600;
      color: #5f6368;
    }
  </style>
</head>
<body>
  <div class="doc-area">
    <div class="doc-title">Research Paper Draft</div>
    <h2>Introduction</h2>
    <p>This comprehensive research paper explores the evolution of large language models...</p>
    <h2>Methodology</h2>
    <p>Our approach combines quantitative analysis with qualitative assessment...</p>
    <h2>Results</h2>
    <p>The findings demonstrate significant improvements in model performance...</p>
  </div>
  <div class="sidebar">
    <div class="gradient-header">
      <h2>TokenTally</h2>
      <p>LLM Token Counter</p>
    </div>
    <div class="sidebar-content">
      <div class="count-display">
        <div class="count-number" id="tokenCount">4,200</div>
        <div class="count-label">tokens (document)</div>
        <div class="budget-bar-container" id="budgetBar">
          <div class="budget-info">
            <span id="budgetUsed">4,200</span>
            <span>8,000</span>
          </div>
          <div class="budget-bar">
            <div class="budget-fill" id="budgetFill" style="width: 52%"></div>
          </div>
        </div>
      </div>
      <div class="section-title">Per-Heading Breakdown</div>
      <div class="heading-list" id="headingList">
        <div class="heading-item">
          <div class="heading-text">Introduction</div>
          <div class="heading-count">1,456</div>
        </div>
        <div class="heading-item">
          <div class="heading-text">Methodology</div>
          <div class="heading-count">1,234</div>
        </div>
        <div class="heading-item">
          <div class="heading-text">Results</div>
          <div class="heading-count">1,510</div>
        </div>
      </div>
    </div>
  </div>
  <script>
    const steps = [
      { delay: 1000, action: () => {
        document.getElementById('budgetBar').classList.add('visible');
      }},
      { delay: 2500, action: () => {
        document.getElementById('tokenCount').textContent = '7,200';
        document.getElementById('budgetUsed').textContent = '7,200';
        document.getElementById('budgetFill').style.width = '90%';
        document.getElementById('budgetFill').classList.add('warning');
      }},
      { delay: 4500, action: () => {
        document.getElementById('tokenCount').textContent = '8,824';
        document.getElementById('budgetUsed').textContent = '8,824';
        document.getElementById('budgetFill').style.width = '100%';
        document.getElementById('budgetFill').classList.remove('warning');
        document.getElementById('budgetFill').classList.add('over');
      }},
      { delay: 6000, action: () => {
        document.getElementById('headingList').classList.add('visible');
      }}
    ];
    
    let stepIndex = 0;
    function runStep() {
      if (stepIndex < steps.length) {
        setTimeout(() => {
          steps[stepIndex].action();
          stepIndex++;
          runStep();
        }, steps[stepIndex].delay);
      }
    }
    window.onload = () => runStep();
  </script>
</body>
</html>
`;

async function captureVideoFromHTML(html, outputName, duration) {
  console.log(`Generating ${outputName}...`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  
  const frameDir = path.join(tempDirPath, outputName);
  if (!fs.existsSync(frameDir)) {
    fs.mkdirSync(frameDir, { recursive: true });
  }
  
  const fps = 10; // Lower FPS for faster generation
  const totalFrames = duration * fps;
  
  for (let i = 0; i < totalFrames; i++) {
    const framePath = path.join(frameDir, `frame_${String(i).padStart(5, '0')}.png`);
    await page.screenshot({ path: framePath });
    await new Promise(resolve => setTimeout(resolve, 1000 / fps));
    
    if (i % 20 === 0) {
      process.stdout.write(`.`);
    }
  }
  process.stdout.write(`\n`);
  
  await browser.close();
  
  // Use ffmpeg to create video from frames
  const videoPath = path.join(demoDirPath, `${outputName}.mp4`);
  const ffmpegCmd = `ffmpeg -y -framerate ${fps} -i "${frameDir}/frame_%05d.png" -c:v libx264 -pix_fmt yuv420p -crf 23 "${videoPath}"`;
  
  try {
    execSync(ffmpegCmd, { stdio: 'inherit' });
    console.log(`Generated: ${outputName}.mp4`);
  } catch (error) {
    console.error(`Error creating video: ${error.message}`);
  }
  
  // Clean up frames
  fs.rmSync(frameDir, { recursive: true, force: true });
}

async function generateVideos() {
  console.log('Generating demo videos...\n');
  
  await captureVideoFromHTML(demo1HTML, 'demo-1-open', 15);
  await captureVideoFromHTML(demo2HTML, 'demo-2-count', 16);
  await captureVideoFromHTML(demo3HTML, 'demo-3-budget', 18);
  
  // Clean up temp directory
  fs.rmSync(tempDirPath, { recursive: true, force: true });
  
  console.log('\nAll demo videos generated successfully!');
}

generateVideos().catch(console.error);
