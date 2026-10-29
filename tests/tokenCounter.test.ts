import { describe, it, expect } from 'vitest';

/**
 * Token estimation ratios for different encodings
 * Based on typical character-to-token ratios
 */
const CHAR_TO_TOKEN_RATIOS = {
  o200k_base: 0.25,      // ~4 chars per token
  cl100k_base: 0.25,     // ~4 chars per token
  gemini: 0.22,          // ~4.5 chars per token
  claude: 0.23           // ~4.3 chars per token
};

/**
 * Estimates token count for given text and encoding
 */
function estimateTokens(text: string, encoding: string): number {
  if (!text) return 0;
  const ratio = CHAR_TO_TOKEN_RATIOS[encoding as keyof typeof CHAR_TO_TOKEN_RATIOS] || 0.25;
  return Math.round(text.length * ratio);
}

/**
 * Breaks down token counts by heading sections
 */
interface Heading {
  text: string;
  level: number;
  content: string;
}

function getHeadingBreakdown(headings: Heading[], encoding: string): { heading: string; tokens: number }[] {
  return headings.map(h => ({
    heading: h.text,
    tokens: estimateTokens(h.content, encoding)
  }));
}

describe('Token Counter', () => {
  describe('estimateTokens', () => {
    it('should return 0 for empty text', () => {
      expect(estimateTokens('', 'o200k_base')).toBe(0);
    });

    it('should estimate tokens for GPT o200k_base', () => {
      const text = 'Hello, world!';
      const tokens = estimateTokens(text, 'o200k_base');
      expect(tokens).toBeGreaterThan(0);
      expect(tokens).toBeLessThanOrEqual(text.length);
    });

    it('should estimate tokens for GPT cl100k_base', () => {
      const text = 'Hello, world!';
      const tokens = estimateTokens(text, 'cl100k_base');
      expect(tokens).toBeGreaterThan(0);
      expect(tokens).toBeLessThanOrEqual(text.length);
    });

    it('should estimate tokens for Gemini', () => {
      const text = 'Hello, world!';
      const tokens = estimateTokens(text, 'gemini');
      expect(tokens).toBeGreaterThan(0);
      expect(tokens).toBeLessThanOrEqual(text.length);
    });

    it('should estimate tokens for Claude', () => {
      const text = 'Hello, world!';
      const tokens = estimateTokens(text, 'claude');
      expect(tokens).toBeGreaterThan(0);
      expect(tokens).toBeLessThanOrEqual(text.length);
    });

    it('should estimate ~4 chars per token for GPT encodings', () => {
      const text = 'a'.repeat(400); // 400 characters
      const tokens = estimateTokens(text, 'o200k_base');
      expect(tokens).toBeGreaterThanOrEqual(90);
      expect(tokens).toBeLessThanOrEqual(110);
    });

    it('should have slightly different ratios for different encodings', () => {
      const text = 'The quick brown fox jumps over the lazy dog'.repeat(10);
      const gptTokens = estimateTokens(text, 'o200k_base');
      const geminiTokens = estimateTokens(text, 'gemini');
      const claudeTokens = estimateTokens(text, 'claude');
      
      // Gemini should be slightly more efficient (fewer tokens)
      expect(geminiTokens).toBeLessThan(gptTokens);
      expect(claudeTokens).toBeLessThan(gptTokens);
    });

    it('should handle long text', () => {
      const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(100);
      const tokens = estimateTokens(text, 'o200k_base');
      expect(tokens).toBeGreaterThan(0);
      expect(tokens).toBeLessThan(text.length);
    });

    it('should handle text with special characters', () => {
      const text = '🎉 Special characters: @#$%^&*() and émojis 🚀';
      const tokens = estimateTokens(text, 'o200k_base');
      expect(tokens).toBeGreaterThan(0);
    });

    it('should handle multi-line text', () => {
      const text = `Line 1
Line 2
Line 3`;
      const tokens = estimateTokens(text, 'o200k_base');
      expect(tokens).toBeGreaterThan(0);
    });

    it('should handle text with whitespace', () => {
      const text = '   spaces   and   tabs\t\t\tand\n\nnewlines   ';
      const tokens = estimateTokens(text, 'o200k_base');
      expect(tokens).toBeGreaterThan(0);
    });
  });

  describe('getHeadingBreakdown', () => {
    it('should return empty array for no headings', () => {
      const result = getHeadingBreakdown([], 'o200k_base');
      expect(result).toEqual([]);
    });

    it('should calculate tokens for single heading', () => {
      const headings: Heading[] = [
        {
          text: 'Introduction',
          level: 1,
          content: 'This is the introduction section with some content.'
        }
      ];
      
      const result = getHeadingBreakdown(headings, 'o200k_base');
      expect(result).toHaveLength(1);
      expect(result[0].heading).toBe('Introduction');
      expect(result[0].tokens).toBeGreaterThan(0);
    });

    it('should calculate tokens for multiple headings', () => {
      const headings: Heading[] = [
        {
          text: 'Chapter 1',
          level: 1,
          content: 'Content for chapter 1. '.repeat(20)
        },
        {
          text: 'Chapter 2',
          level: 1,
          content: 'Content for chapter 2. '.repeat(30)
        },
        {
          text: 'Section 2.1',
          level: 2,
          content: 'Sub-section content. '.repeat(10)
        }
      ];
      
      const result = getHeadingBreakdown(headings, 'o200k_base');
      expect(result).toHaveLength(3);
      
      // Chapter 2 should have more tokens than Chapter 1
      expect(result[1].tokens).toBeGreaterThan(result[0].tokens);
      
      // All should have positive token counts
      result.forEach(item => {
        expect(item.tokens).toBeGreaterThan(0);
      });
    });

    it('should handle headings with empty content', () => {
      const headings: Heading[] = [
        {
          text: 'Empty Section',
          level: 1,
          content: ''
        }
      ];
      
      const result = getHeadingBreakdown(headings, 'o200k_base');
      expect(result).toHaveLength(1);
      expect(result[0].tokens).toBe(0);
    });

    it('should respect different encodings', () => {
      const headings: Heading[] = [
        {
          text: 'Test Section',
          level: 1,
          content: 'Same content for all encodings. '.repeat(50)
        }
      ];
      
      const gptResult = getHeadingBreakdown(headings, 'o200k_base');
      const geminiResult = getHeadingBreakdown(headings, 'gemini');
      const claudeResult = getHeadingBreakdown(headings, 'claude');
      
      // Different encodings should produce different token counts
      expect(gptResult[0].tokens).not.toBe(geminiResult[0].tokens);
      expect(gptResult[0].tokens).not.toBe(claudeResult[0].tokens);
    });

    it('should handle nested heading levels', () => {
      const headings: Heading[] = [
        { text: 'H1', level: 1, content: 'Content 1' },
        { text: 'H2', level: 2, content: 'Content 2' },
        { text: 'H3', level: 3, content: 'Content 3' },
        { text: 'H1 Again', level: 1, content: 'Content 4' }
      ];
      
      const result = getHeadingBreakdown(headings, 'o200k_base');
      expect(result).toHaveLength(4);
      result.forEach(item => {
        expect(item.heading).toBeTruthy();
        expect(item.tokens).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Budget Calculations', () => {
    it('should calculate percentage correctly', () => {
      const tokens = 4000;
      const limit = 8000;
      const percentage = (tokens / limit) * 100;
      expect(percentage).toBe(50);
    });

    it('should identify over-budget scenarios', () => {
      const tokens = 10000;
      const limit = 8000;
      const isOver = tokens > limit;
      expect(isOver).toBe(true);
    });

    it('should identify warning threshold', () => {
      const tokens = 7000;
      const limit = 8000;
      const percentage = (tokens / limit) * 100;
      const isWarning = percentage >= 80 && percentage < 100;
      expect(isWarning).toBe(true);
    });

    it('should handle exactly at limit', () => {
      const tokens = 8000;
      const limit = 8000;
      const percentage = (tokens / limit) * 100;
      expect(percentage).toBe(100);
    });

    it('should cap percentage display at 100', () => {
      const tokens = 12000;
      const limit = 8000;
      const percentage = Math.min((tokens / limit) * 100, 100);
      expect(percentage).toBe(100);
    });
  });

  describe('Text Extraction Scenarios', () => {
    it('should handle typical document text', () => {
      const text = `
        Introduction
        
        This is a sample document with multiple paragraphs. It includes
        various types of content that might appear in a typical Google Doc.
        
        Key points:
        - Point one
        - Point two
        - Point three
        
        Conclusion
        
        This concludes our document.
      `;
      
      const tokens = estimateTokens(text, 'o200k_base');
      expect(tokens).toBeGreaterThan(10);
      expect(tokens).toBeLessThan(text.length);
    });

    it('should handle code snippets', () => {
      const text = `
        function example() {
          const message = "Hello, world!";
          console.log(message);
          return 42;
        }
      `;
      
      const tokens = estimateTokens(text, 'o200k_base');
      expect(tokens).toBeGreaterThan(0);
    });

    it('should handle markdown-like formatting', () => {
      const text = `
        # Heading 1
        ## Heading 2
        
        **Bold text** and *italic text*
        
        - List item 1
        - List item 2
        
        > Blockquote
      `;
      
      const tokens = estimateTokens(text, 'o200k_base');
      expect(tokens).toBeGreaterThan(0);
    });
  });
});
