/**
 * TokenTally color palette and constants
 */

export const APP_COLOR_BLUE = "rgba(157,214,252,1)";
export const APP_COLOR_PURPLE = "rgb(202, 160, 250)";
export const APP_COLOR_GRADIENT = "bg-gradient-to-r from-[rgba(209,127,247,1)] to-[rgba(157,214,252,1)]";
export const APP_COLOR_GRADIENT_CSS = "linear-gradient(to right, rgba(209,127,247,1), rgba(157,214,252,1))";

export const APP_NAME = "TokenTally";
export const DRIVEIO_HOME = "https://www.driveio.io/?referrer=TokenTally";
export const DRIVEIO_COPY_FOLDER = "https://www.driveio.io/standalone-plans/copy-folder-in-google-drive-extension?referrer=TokenTally";

// User property keys
export const PROP_ENCODING = "encoding";
export const PROP_BUDGET_LIMIT = "budgetLimit";
export const PROP_SHOW_BUDGET = "showBudget";
export const PROP_FIRST_RUN = "firstRun";

// Default values
export const DEFAULT_ENCODING = "o200k_base";
export const DEFAULT_BUDGET_LIMIT = 8000;

// Encoding options
export const ENCODINGS = {
  o200k_base: { name: "GPT o200k_base", type: "exact" },
  cl100k_base: { name: "GPT cl100k_base", type: "exact" },
  gemini: { name: "Gemini (estimate)", type: "estimate" },
  claude: { name: "Claude (estimate)", type: "estimate" }
};
