/**
 * Exact tokenization using js-tiktoken
 * This file will be bundled and inlined into Sidebar.html
 */

import { encodingForModel } from 'js-tiktoken';

// Cache encoders
let o200kEncoder: any = null;
let cl100kEncoder: any = null;

/**
 * Initialize encoders (call once)
 */
function initEncoders() {
  if (!o200kEncoder) {
    o200kEncoder = encodingForModel('gpt-4o');
  }
  if (!cl100kEncoder) {
    cl100kEncoder = encodingForModel('gpt-4');
  }
}

/**
 * Count tokens using exact tokenization
 */
export function countTokens(text: string, encoding: string): number {
  if (!text) return 0;
  
  initEncoders();
  
  switch (encoding) {
    case 'o200k_base':
      return o200kEncoder.encode(text).length;
    
    case 'cl100k_base':
      return cl100kEncoder.encode(text).length;
    
    case 'gemini':
      // Gemini estimate: ~4.5 chars per token
      return Math.round(text.length * 0.22);
    
    case 'claude':
      // Claude estimate: ~4.3 chars per token
      return Math.round(text.length * 0.23);
    
    default:
      return Math.round(text.length * 0.25);
  }
}

// Expose to window for use in HTML
declare const window: any;
if (typeof window !== 'undefined') {
  window.countTokens = countTokens;
}
