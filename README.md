# TokenTally

<div align="center">
  <img src="branding/logo-128.png" alt="TokenTally Logo" width="128" height="128">
  <br><br>
  <p><strong>LLM Token Counter for Google Docs</strong></p>
</div>

## Features

TokenTally is a Google Docs editor add-on that helps you track LLM token counts in real-time:

- **📊 Live Token Counting**: See token counts for your entire document or selected text
- **🎯 Multiple Encodings**: 
  - GPT o200k_base (exact, client-side)
  - GPT cl100k_base (exact, client-side)
  - Gemini (estimate)
  - Claude (estimate)
- **📑 Per-Heading Breakdown**: View token counts for each section of your document
- **💰 Budget Tracking**: Set token limits and get visual warnings when approaching or exceeding them
- **🔄 Live Updates**: Automatic polling while sidebar is open keeps counts current
- **⚙️ Persistent Settings**: Your preferences are saved between sessions
- **🔒 Privacy First**: All counting happens client-side, no data leaves your browser

## How It Works

1. Open any Google Docs document
2. Go to **Extensions > TokenTally > Open**
3. View real-time token counts in the sidebar
4. Select text to count just that portion
5. Switch between different LLM encodings
6. Set a budget limit to track your token usage

Perfect for staying within LLM context limits when preparing prompts, documentation, or content!

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [clasp](https://github.com/google/clasp) - Google Apps Script CLI

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd tokentally
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Login to clasp**
   ```bash
   npx clasp login
   ```

4. **Create a new Google Apps Script project**
   ```bash
   npx clasp create --type docs --title "TokenTally"
   ```
   
   This will create a new script and update `.clasp.json` with your script ID.

5. **Build and push the code**
   ```bash
   npm run build
   npm run push
   ```

6. **Open the script in the Apps Script editor**
   ```bash
   npx clasp open
   ```

7. **Set up the logo URL** (optional but recommended for add-on publishing)
   - Host `branding/logo-128.png` on a publicly accessible URL
   - Update `appsscript.json` and replace `YOUR_LOGO_URL_HERE` with your hosted logo URL:
     ```json
     "addOns": {
       "common": {
         "logoUrl": "https://your-domain.com/logo-128.png"
       }
     }
     ```
   - The logo must be:
     - Exactly 128x128 pixels
     - PNG format
     - Publicly accessible via HTTPS
     - Less than 32KB in size

### Development Workflow

- **Build**: Compile TypeScript to JavaScript
  ```bash
  npm run build
  ```

- **Watch**: Auto-compile on file changes
  ```bash
  npm run watch
  ```

- **Push**: Build and deploy to Apps Script
  ```bash
  npm run push
  ```

- **Deploy**: Create a deployment version
  ```bash
  npm run deploy
  ```

- **Test**: Run unit tests
  ```bash
  npm test
  ```

## Project Structure

```
tokentally/
├── src/
│   ├── Code.ts           # Main entry point, menu handlers
│   ├── Sidebar.html      # Sidebar UI with token counting
│   └── constants.ts      # Color palette and constants
├── tests/
│   └── tokenCounter.test.ts  # Unit tests
├── branding/             # Logo and asset files
│   ├── tokentally.svg
│   ├── tokentally-512.png
│   ├── logo-128.png
│   ├── logo-96.png
│   ├── logo-32.png
│   └── card-banner-220x140.png
├── demo/
│   └── videos/          # Demo videos for marketplace
├── build/               # Compiled output (git-ignored)
├── package.json
├── tsconfig.json
├── appsscript.json
├── .clasp.json
├── README.md
└── PRIVACY.md
```

## OAuth Scopes

TokenTally uses only non-restricted scopes:

- `https://www.googleapis.com/auth/documents.currentonly` - Read the currently open document
- `https://www.googleapis.com/auth/script.container.ui` - Show the sidebar interface

These scopes do not require verification, making TokenTally free and easy to publish.

## Publishing to Google Workspace Marketplace

1. Complete the setup steps above
2. Host the logo-128.png file and update `appsscript.json`
3. In the Apps Script editor, click **Deploy > New deployment**
4. Choose **Add-on** as the deployment type
5. Follow [Google's add-on publishing guide](https://developers.google.com/workspace/marketplace/how-to-publish)

## Token Counting Methods

### Exact Counting (GPT)

For GPT encodings (o200k_base and cl100k_base), TokenTally uses the js-tiktoken library bundled client-side. This provides exact token counts matching OpenAI's tokenization.

### Estimates (Gemini & Claude)

For Gemini and Claude, TokenTally provides estimates based on character-to-token ratios. These are clearly labeled as estimates in the UI.

## Design Palette

TokenTally uses a distinctive gradient color scheme:

- **Purple**: `rgba(209,127,247,1)`
- **Blue**: `rgba(157,214,252,1)`
- **Gradient**: Left-to-right from purple to blue

## Support

- **Need to copy a Google Drive folder?** Check out [Drive I/O Copy Folder](https://www.driveio.io/standalone-plans/copy-folder-in-google-drive-extension?referrer=TokenTally)
- Visit [driveio.io](https://www.driveio.io/?referrer=TokenTally) for more productivity tools

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Requirements

- Google Docs document
- Modern web browser with JavaScript enabled

## Roadmap

- [ ] Bundle full js-tiktoken for exact GPT tokenization
- [ ] Add more encoding options (GPT-3.5, GPT-4, etc.)
- [ ] Export token count reports
- [ ] Token usage history tracking
- [ ] Multi-document comparison

## Demo Videos

See `demo/videos/` for demonstration videos showing:
- Opening and onboarding
- Real-time token counting with encoding selection
- Budget tracking and per-heading breakdown
