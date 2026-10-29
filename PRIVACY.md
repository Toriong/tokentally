# Privacy Policy for TokenTally

**Last Updated:** October 29, 2026

## Overview

TokenTally is a Google Docs editor add-on that helps users count LLM tokens in their documents. This privacy policy explains how TokenTally handles your data.

## Data Collection and Usage

### What Data We Access

TokenTally requests access to:

1. **Current Document Data** (`documents.currentonly` scope):
   - Document text and structure
   - Selected text
   - Heading structure
   - Used solely for token counting

2. **UI Permissions** (`script.container.ui` scope):
   - Permission to display the TokenTally sidebar within Google Docs

### What We Do With Your Data

- **Reading Only**: TokenTally reads your document text solely to count tokens
- **No Storage**: No document text is stored, saved, or transmitted to any external servers
- **Client-Side Processing**: All token counting happens locally in your browser
- **No File Creation**: TokenTally does not create, modify, or access any Google Drive files
- **Settings Only**: Only your preferences (encoding choice, budget limit) are saved using Google's PropertiesService
- **No Analytics**: TokenTally does not collect usage analytics, tracking data, or personal information

### What We Don't Do

- ❌ Store or save document text
- ❌ Transmit data to external servers
- ❌ Access other documents in your Drive
- ❌ Track user behavior or analytics
- ❌ Share data with third parties
- ❌ Use data for advertising or marketing

## How TokenTally Works

1. You open a Google Docs document
2. You click **Extensions > TokenTally > Open**
3. TokenTally reads the current document text
4. Token counts are calculated in your browser
5. Results are displayed in the sidebar
6. When you close the sidebar, all data is discarded

## User Settings

TokenTally stores only these settings using Google's PropertiesService:

- Selected encoding (GPT, Gemini, or Claude)
- Budget limit value
- Whether to show budget bar
- First-run completion status

These settings are stored in your Google account and are not accessible to anyone else.

## Third-Party Services

TokenTally includes promotional links to Drive I/O (driveio.io), a separate service. These links are optional and clicking them is entirely your choice. Drive I/O has its own privacy policy.

## OAuth Scopes

TokenTally uses minimal, non-restricted OAuth scopes:

- `https://www.googleapis.com/auth/documents.currentonly` - Read the currently open document only
- `https://www.googleapis.com/auth/script.container.ui` - Display the TokenTally interface

These scopes are **not restricted** by Google, meaning they do not require additional verification or security assessment.

## Data Security

- TokenTally runs entirely within Google's secure Apps Script environment
- No external servers or databases are involved
- Data never leaves your Google account
- All communication stays within Google's infrastructure

## Children's Privacy

TokenTally does not knowingly collect or store data from children under 13. The add-on is designed for general document editing and token counting.

## Changes to This Policy

We may update this privacy policy from time to time. Changes will be posted in this document with an updated "Last Updated" date.

## Your Rights

You have the right to:

- Review the add-on's source code (it's open source)
- Revoke TokenTally's permissions at any time via Google Account settings
- Uninstall the add-on at any time

To revoke access:
1. Go to [Google Account Permissions](https://myaccount.google.com/permissions)
2. Find TokenTally in the list
3. Click **Remove Access**

## Contact

For questions about this privacy policy or TokenTally's data practices, please:

- Open an issue on the GitHub repository
- Contact the developer through the Google Workspace Marketplace listing

## Compliance

TokenTally complies with:

- Google Workspace Marketplace policies
- Google API Services User Data Policy
- OAuth 2.0 security requirements

## Open Source

TokenTally is open source software. You can review the complete source code to verify these privacy claims.

---

**Summary**: TokenTally reads document text from the open document, counts tokens in your browser, displays results, and then discards everything when closed. No data is stored, transmitted, or shared. Period.
