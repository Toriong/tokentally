import { describe, it, expect } from 'vitest';
import { encodingForModel } from 'js-tiktoken';

/**
 * Token counting using real js-tiktoken for GPT encodings
 * and estimates for Gemini/Claude
 */
function countTokens(text: string, encoding: string): number {
  if (!text) return 0;
  
  switch (encoding) {
    case 'o200k_base': {
      const encoder = encodingForModel('gpt-4o');
      return encoder.encode(text).length;
    }
    
    case 'cl100k_base': {
      const encoder = encodingForModel('gpt-4');
      return encoder.encode(text).length;
    }
    
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
    tokens: countTokens(h.content, encoding)
  }));
}

describe('Token Counter - Exact Tokenization', () => {
  describe('GPT o200k_base - EXACT counts', () => {
    it('should return 0 for empty text', () => {
      expect(countTokens('', 'o200k_base')).toBe(0);
    });

    it('should count "hello world" exactly', () => {
      const tokens = countTokens('hello world', 'o200k_base');
      expect(tokens).toBe(2); // Exact: "hello" + " world"
    });

    it('should count "Hello, world!" exactly', () => {
      const tokens = countTokens('Hello, world!', 'o200k_base');
      expect(tokens).toBe(4); // Exact: "Hello", ",", " world", "!"
    });

    it('should count longer text exactly', () => {
      const text = 'The quick brown fox jumps over the lazy dog';
      const tokens = countTokens(text, 'o200k_base');
      expect(tokens).toBe(9); // Exact token count
    });

    it('should count paragraph exactly', () => {
      const text = `This is a test paragraph. It contains multiple sentences. Each sentence should be tokenized correctly by the o200k_base encoding.`;
      const tokens = countTokens(text, 'o200k_base');
      expect(tokens).toBe(26); // Exact token count
    });

    it('should handle special characters', () => {
      const text = '🎉 Special: @#$%^&*() émojis 🚀';
      const tokens = countTokens(text, 'o200k_base');
      expect(tokens).toBeGreaterThan(0);
      expect(tokens).toBeLessThan(text.length); // Should be much less than char count
    });

    it('should handle newlines and whitespace', () => {
      const text = 'Line 1\nLine 2\nLine 3';
      const tokens = countTokens(text, 'o200k_base');
      expect(tokens).toBe(11); // Exact count
    });

    it('should be consistent across multiple calls', () => {
      const text = 'Consistency test';
      const tokens1 = countTokens(text, 'o200k_base');
      const tokens2 = countTokens(text, 'o200k_base');
      expect(tokens1).toBe(tokens2);
    });
  });

  describe('GPT cl100k_base - EXACT counts', () => {
    it('should return 0 for empty text', () => {
      expect(countTokens('', 'cl100k_base')).toBe(0);
    });

    it('should count "hello world" exactly', () => {
      const tokens = countTokens('hello world', 'cl100k_base');
      expect(tokens).toBe(2); // Exact: "hello" + " world"
    });

    it('should count "Hello, world!" exactly', () => {
      const tokens = countTokens('Hello, world!', 'cl100k_base');
      expect(tokens).toBe(4); // Exact count
    });

    it('should count longer text exactly', () => {
      const text = 'The quick brown fox jumps over the lazy dog';
      const tokens = countTokens(text, 'cl100k_base');
      expect(tokens).toBe(9); // Exact token count
    });

    it('should handle code snippets', () => {
      const text = 'function example() { return 42; }';
      const tokens = countTokens(text, 'cl100k_base');
      expect(tokens).toBe(9); // Exact count
    });

    it('should be consistent', () => {
      const text = 'Test consistency';
      const tokens1 = countTokens(text, 'cl100k_base');
      const tokens2 = countTokens(text, 'cl100k_base');
      expect(tokens1).toBe(tokens2);
    });
  });

  describe('Encoding comparison - GPT encodings', () => {
    it('o200k_base and cl100k_base should produce same counts for simple text', () => {
      const text = 'hello world';
      const o200k = countTokens(text, 'o200k_base');
      const cl100k = countTokens(text, 'cl100k_base');
      expect(o200k).toBe(cl100k);
    });

    it('should produce exact counts, not estimates', () => {
      const text = 'Testing tokenization accuracy';
      const tokens = countTokens(text, 'o200k_base');
      // Should not be a simple ratio-based estimate
      expect(tokens).not.toBe(Math.round(text.length * 0.25));
      expect(tokens).toBe(4); // Exact count
    });
  });

  describe('Gemini estimates', () => {
    it('should return 0 for empty text', () => {
      expect(countTokens('', 'gemini')).toBe(0);
    });

    it('should estimate tokens for Gemini', () => {
      const text = 'Hello, world!';
      const tokens = countTokens(text, 'gemini');
      expect(tokens).toBeGreaterThan(0);
      expect(tokens).toBeLessThanOrEqual(text.length);
    });

    it('should estimate tokens reasonably', () => {
      const text = 'The quick brown fox jumps over the lazy dog'.repeat(10);
      const geminiTokens = countTokens(text, 'gemini');
      
      // Should produce reasonable estimates
      expect(geminiTokens).toBeGreaterThan(0);
      expect(geminiTokens).toBeLessThan(text.length);
    });
  });

  describe('Claude estimates', () => {
    it('should return 0 for empty text', () => {
      expect(countTokens('', 'claude')).toBe(0);
    });

    it('should estimate tokens for Claude', () => {
      const text = 'Hello, world!';
      const tokens = countTokens(text, 'claude');
      expect(tokens).toBeGreaterThan(0);
      expect(tokens).toBeLessThanOrEqual(text.length);
    });

    it('should produce reasonable estimates', () => {
      const text = 'a'.repeat(400);
      const tokens = countTokens(text, 'claude');
      expect(tokens).toBeGreaterThanOrEqual(80);
      expect(tokens).toBeLessThanOrEqual(110);
    });
  });

  describe('Per-heading breakdown', () => {
    it('should return empty array for no headings', () => {
      const result = getHeadingBreakdown([], 'o200k_base');
      expect(result).toEqual([]);
    });

    it('should calculate exact tokens for single heading', () => {
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
      expect(result[0].tokens).toBe(9); // Exact count
    });

    it('should calculate exact tokens for multiple headings', () => {
      const headings: Heading[] = [
        {
          text: 'Chapter 1',
          level: 1,
          content: 'First chapter content here.'
        },
        {
          text: 'Chapter 2',
          level: 1,
          content: 'Second chapter with more detailed content about various topics.'
        }
      ];
      
      const result = getHeadingBreakdown(headings, 'o200k_base');
      expect(result).toHaveLength(2);
      
      // Chapter 2 should have more tokens
      expect(result[1].tokens).toBeGreaterThan(result[0].tokens);
      
      // Check exact counts
      expect(result[0].tokens).toBe(5);
      expect(result[1].tokens).toBe(10);
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

    it('should use exact counts with o200k_base', () => {
      const headings: Heading[] = [
        {
          text: 'Test',
          level: 1,
          content: 'hello world'
        }
      ];
      
      const result = getHeadingBreakdown(headings, 'o200k_base');
      expect(result[0].tokens).toBe(2); // Exact, not estimate
    });
  });

  describe('Budget calculations', () => {
    it('should calculate percentage correctly', () => {
      const tokens = 4000;
      const limit = 8000;
      const percentage = (tokens / limit) * 100;
      expect(percentage).toBe(50);
    });

    it('should identify over-budget with exact counts', () => {
      const text = 'hello world '.repeat(5000); // Repeat to get over 8000 tokens (3 tokens each * 5000 = 15000)
      const tokens = countTokens(text, 'o200k_base');
      const limit = 8000;
      const isOver = tokens > limit;
      expect(tokens).toBeGreaterThan(limit);
      expect(isOver).toBe(true);
    });

    it('should calculate warning threshold accurately', () => {
      const tokens = 7000;
      const limit = 8000;
      const percentage = (tokens / limit) * 100;
      const isWarning = percentage >= 80 && percentage < 100;
      expect(isWarning).toBe(true);
    });
  });

  describe('Real-world document scenarios', () => {
    it('should handle typical document with exact counts', () => {
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
      
      const tokens = countTokens(text, 'o200k_base');
      expect(tokens).toBe(61); // Exact count
    });

    it('should handle markdown-style content exactly', () => {
      const text = `# Heading 1
## Heading 2

**Bold text** and *italic text*

- List item 1
- List item 2`;
      
      const tokens = countTokens(text, 'o200k_base');
      expect(tokens).toBe(30); // Exact count
    });

    it('should handle large documents efficiently', () => {
      const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(100);
      const tokens = countTokens(text, 'o200k_base');
      expect(tokens).toBeGreaterThan(100);
      expect(tokens).toBeLessThan(text.length);
    });
  });

  describe('Known exact token counts', () => {
    const testCases = [
      { text: 'hello', encoding: 'o200k_base', expected: 1 },
      { text: 'hello world', encoding: 'o200k_base', expected: 2 },
      { text: 'The cat sat on the mat', encoding: 'o200k_base', expected: 6 },
      { text: 'hello', encoding: 'cl100k_base', expected: 1 },
      { text: 'hello world', encoding: 'cl100k_base', expected: 2 },
      { text: '1234567890', encoding: 'o200k_base', expected: 4 },
      { text: 'Testing: one, two, three!', encoding: 'o200k_base', expected: 8 },
    ];

    testCases.forEach(({ text, encoding, expected }) => {
      it(`should count "${text}" as exactly ${expected} tokens (${encoding})`, () => {
        const actual = countTokens(text, encoding);
        expect(actual).toBe(expected);
      });
    });
  });
});
