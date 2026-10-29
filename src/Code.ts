/**
 * TokenTally - LLM Token Counter for Google Docs
 */

import {
  APP_NAME,
  PROP_ENCODING,
  PROP_BUDGET_LIMIT,
  PROP_SHOW_BUDGET,
  PROP_FIRST_RUN,
  DEFAULT_ENCODING,
  DEFAULT_BUDGET_LIMIT
} from "./constants";

/**
 * Creates menu on document open
 */
function onOpen() {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem("Open", "showSidebar")
    .addItem("Copy Google Drive folders with Drive I/O", "openDriveIO")
    .addToUi();
}

/**
 * Shows the sidebar
 */
function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile("Sidebar")
    .setTitle(APP_NAME)
    .setWidth(320);
  DocumentApp.getUi().showSidebar(html);
}

/**
 * Opens Drive I/O in a new tab
 */
function openDriveIO() {
  const html = HtmlService.createHtmlOutput(
    '<script>window.open("https://www.driveio.io/standalone-plans/copy-folder-in-google-drive-extension?referrer=TokenTally", "_blank"); google.script.host.close();</script>'
  );
  DocumentApp.getUi().showModalDialog(html, "Opening Drive I/O...");
}

/**
 * Gets document text and headings structure
 */
function getDocumentData(): DocumentData {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  // Get full document text
  const fullText = body.getText();
  
  // Get headings structure
  const headings: Heading[] = [];
  const paragraphs = body.getParagraphs();
  
  let lastHeadingIndex = -1;
  let lastHeadingLevel = 0;
  
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const heading = paragraph.getHeading();
    
    if (heading !== DocumentApp.ParagraphHeading.NORMAL) {
      const text = paragraph.getText();
      if (text.trim()) {
        const level = getHeadingLevel(heading);
        const startIndex = body.getText().indexOf(text);
        
        // Save content from previous heading
        if (lastHeadingIndex >= 0) {
          const content = body.getText().substring(
            lastHeadingIndex,
            startIndex
          );
          headings[headings.length - 1].content = content;
        }
        
        headings.push({
          text: text.trim(),
          level: level,
          content: ""
        });
        
        lastHeadingIndex = startIndex + text.length;
        lastHeadingLevel = level;
      }
    }
  }
  
  // Add content for last heading
  if (lastHeadingIndex >= 0 && headings.length > 0) {
    const content = body.getText().substring(lastHeadingIndex);
    headings[headings.length - 1].content = content;
  }
  
  return {
    fullText: fullText,
    headings: headings
  };
}

/**
 * Gets selected text
 */
function getSelection(): string | null {
  const selection = DocumentApp.getActiveDocument().getSelection();
  if (!selection) return null;
  
  const elements = selection.getRangeElements();
  if (elements.length === 0) return null;
  
  let text = "";
  for (const element of elements) {
    const elem = element.getElement();
    try {
      const textElem = elem.asText();
      if (element.isPartial()) {
        text += textElem.getText().substring(
          element.getStartOffset(),
          element.getEndOffsetInclusive() + 1
        );
      } else {
        text += textElem.getText();
      }
    } catch (e) {
      // Element is not text, skip it
    }
  }
  
  return text || null;
}

/**
 * Gets user settings
 */
function getSettings(): Settings {
  const props = PropertiesService.getUserProperties();
  const isFirstRun = props.getProperty(PROP_FIRST_RUN) !== "false";
  
  return {
    encoding: props.getProperty(PROP_ENCODING) || DEFAULT_ENCODING,
    budgetLimit: parseInt(props.getProperty(PROP_BUDGET_LIMIT) || String(DEFAULT_BUDGET_LIMIT)),
    showBudget: props.getProperty(PROP_SHOW_BUDGET) === "true",
    firstRun: isFirstRun
  };
}

/**
 * Saves user settings
 */
function saveSettings(settings: Settings): void {
  const props = PropertiesService.getUserProperties();
  props.setProperty(PROP_ENCODING, settings.encoding);
  props.setProperty(PROP_BUDGET_LIMIT, String(settings.budgetLimit));
  props.setProperty(PROP_SHOW_BUDGET, String(settings.showBudget));
  props.setProperty(PROP_FIRST_RUN, "false");
}

/**
 * Helper to convert paragraph heading to numeric level
 */
function getHeadingLevel(heading: GoogleAppsScript.Document.ParagraphHeading): number {
  switch (heading) {
    case DocumentApp.ParagraphHeading.HEADING1:
      return 1;
    case DocumentApp.ParagraphHeading.HEADING2:
      return 2;
    case DocumentApp.ParagraphHeading.HEADING3:
      return 3;
    case DocumentApp.ParagraphHeading.HEADING4:
      return 4;
    case DocumentApp.ParagraphHeading.HEADING5:
      return 5;
    case DocumentApp.ParagraphHeading.HEADING6:
      return 6;
    default:
      return 0;
  }
}

// Type definitions
interface DocumentData {
  fullText: string;
  headings: Heading[];
}

interface Heading {
  text: string;
  level: number;
  content: string;
}

interface Settings {
  encoding: string;
  budgetLimit: number;
  showBudget: boolean;
  firstRun: boolean;
}
