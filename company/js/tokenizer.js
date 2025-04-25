/**
 * GPT-2 Tokenizer
 * A tokenizer that analyzes text using the GPT-2 model
 */

class GPT2Tokenizer {
  constructor() {
    // API endpoint for the GPT-2 model
    this.apiEndpoint = '/api/analyze';

    // Fallback to client-side analysis if API is unavailable
    this.useClientSideFallback = true;

    // The golden ratio for fallback calculations
    this.PHI = 1.618;

    // Common English word frequencies for analysis
    this.commonWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at'
    ]);

    // Redundant phrases that reduce efficiency
    this.redundantPhrases = [
      'very', 'really', 'actually', 'basically', 'literally', 'just',
      'simply', 'quite', 'rather', 'somewhat', 'kind of', 'sort of'
    ];
  }

  /**
   * Analyze text using the Llama model
   * @param {string} text - The text to analyze
   * @returns {Promise<object>} Analysis results
   */
  async analyze(text) {
    try {
      // Try to use the Llama API
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('API call failed, using client-side fallback:', error);

      if (this.useClientSideFallback) {
        // Use client-side analysis as fallback
        return this.analyzeClientSide(text);
      } else {
        throw error;
      }
    }
  }

  /**
   * Analyze text using client-side algorithms (fallback)
   * @param {string} text - The text to analyze
   * @returns {object} Analysis results
   */
  analyzeClientSide(text) {
    // Basic text metrics
    const charCount = text.length;
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;

    // Calculate token count (more sophisticated than simple word count)
    const tokenCount = this.countTokens(text);

    // Calculate golden ratio alignment
    const alignment = this.calculateGoldenRatioAlignment(text);

    // Calculate efficiency
    const efficiency = this.calculateEfficiency(text);

    // Calculate optimization potential
    const potential = this.calculateOptimizationPotential(text);

    return {
      tokenCount,
      efficiency,
      potential,
      alignment,
      charCount,
      wordCount,
      sentenceCount,
      model: 'GPT-2 (Fallback)'
    };
  }

  /**
   * Count tokens in text using a more sophisticated algorithm
   * @param {string} text - The text to count tokens in
   * @returns {number} Estimated token count
   */
  countTokens(text) {
    // This is a simplified version of how tokenization works
    // Real tokenizers use more complex algorithms

    // Split text into words
    const words = text.split(/\s+/).filter(w => w.length > 0);

    // Count special tokens (punctuation, etc.)
    const specialTokens = (text.match(/[.,!?;:()[\]{}""''`\-–—]/g) || []).length;

    // Count numbers as separate tokens
    const numbers = (text.match(/\b\d+(?:\.\d+)?\b/g) || []).length;

    // Count capitalized words (names, etc.) which might be treated differently
    const capitalizedWords = words.filter(w => /^[A-Z][a-z]*$/.test(w)).length;

    // Base token count (roughly 4 characters per token for English)
    let baseTokenCount = Math.ceil(text.length / 4);

    // Adjust based on special cases
    baseTokenCount += Math.floor(specialTokens * 0.5);
    baseTokenCount += Math.floor(numbers * 0.3);
    baseTokenCount += Math.floor(capitalizedWords * 0.2);

    return Math.max(1, baseTokenCount);
  }

  /**
   * Calculate how well the text aligns with golden ratio principles
   * @param {string} text - The text to analyze
   * @returns {number} Alignment score (0-100)
   */
  calculateGoldenRatioAlignment(text) {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Calculate sentence lengths
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).filter(w => w.length > 0).length);
    const avgSentenceLength = sentenceLengths.reduce((sum, len) => sum + len, 0) / sentenceLengths.length || 0;

    // Calculate word lengths
    const wordLengths = words.map(w => w.length);
    const avgWordLength = wordLengths.reduce((sum, len) => sum + len, 0) / wordLengths.length || 0;

    // Calculate paragraph structure (if applicable)
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const paragraphLengths = paragraphs.map(p => p.trim().split(/\s+/).filter(w => w.length > 0).length);
    const avgParagraphLength = paragraphLengths.reduce((sum, len) => sum + len, 0) / paragraphLengths.length || 0;

    // Calculate how close these metrics are to golden ratio ideals
    // Ideal sentence length: ~16 words (phi * 10)
    const sentenceRatioDiff = Math.abs(avgSentenceLength - (this.PHI * 10)) / (this.PHI * 10);

    // Ideal word length: ~5 characters (phi * 3)
    const wordRatioDiff = Math.abs(avgWordLength - (this.PHI * 3)) / (this.PHI * 3);

    // Ideal paragraph length: ~81 words (phi^4)
    const paragraphRatioDiff = Math.abs(avgParagraphLength - Math.pow(this.PHI, 4)) / Math.pow(this.PHI, 4);

    // Calculate overall alignment score (higher is better)
    const alignmentScore = 100 - ((sentenceRatioDiff + wordRatioDiff + paragraphRatioDiff) * 33);

    return Math.min(100, Math.max(65, alignmentScore));
  }

  /**
   * Calculate the efficiency of the text
   * @param {string} text - The text to analyze
   * @returns {number} Efficiency score (0-100)
   */
  calculateEfficiency(text) {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    if (wordCount === 0) {
      return 70; // Default for empty text
    }

    // Calculate average word length
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / wordCount;

    // Calculate common word usage (higher is more efficient)
    const commonWordCount = words.filter(w => this.commonWords.has(w.toLowerCase())).length;
    const commonWordRatio = commonWordCount / wordCount;

    // Calculate sentence complexity
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0;

    // Ideal word length is close to golden ratio * 2
    const idealWordLength = this.PHI * 2;
    const wordLengthEfficiency = 100 - (Math.abs(avgWordLength - idealWordLength) / idealWordLength * 30);

    // Ideal common word ratio is around 0.5 (balance between common and specific words)
    const commonWordEfficiency = 100 - (Math.abs(commonWordRatio - 0.5) * 100);

    // Ideal sentence length is around golden ratio * 10
    const idealSentenceLength = this.PHI * 10;
    const sentenceLengthEfficiency = avgSentenceLength > 0
      ? 100 - (Math.abs(avgSentenceLength - idealSentenceLength) / idealSentenceLength * 30)
      : 70; // Default for no sentences

    // Calculate overall efficiency
    const efficiency = (wordLengthEfficiency * 0.4) + (commonWordEfficiency * 0.3) + (sentenceLengthEfficiency * 0.3);

    return Math.min(95, Math.max(70, efficiency));
  }

  /**
   * Calculate the optimization potential of the text
   * @param {string} text - The text to analyze
   * @returns {number} Optimization potential (0-100)
   */
  calculateOptimizationPotential(text) {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    if (wordCount === 0) {
      return 80; // Default for empty text
    }

    // Count redundant phrases
    let redundantCount = 0;
    this.redundantPhrases.forEach(phrase => {
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      const matches = text.match(regex) || [];
      redundantCount += matches.length;
    });

    // Calculate redundancy factor
    const redundancyFactor = Math.min(1, redundantCount / wordCount * 10);

    // Calculate passive voice usage
    const passiveVoiceCount = (text.match(/\b(?:am|is|are|was|were|be|been|being)\s+\w+ed\b/g) || []).length;
    const passiveVoiceFactor = Math.min(1, passiveVoiceCount / wordCount * 20);

    // Calculate sentence variety
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).filter(w => w.length > 0).length);
    const sentenceLengthVariety = this.calculateStandardDeviation(sentenceLengths);
    const sentenceVarietyFactor = Math.min(1, Math.max(0, 1 - sentenceLengthVariety / 10));

    // Calculate overall optimization potential
    const basePotential = 75;
    const potential = basePotential + (redundancyFactor * 10) + (passiveVoiceFactor * 10) + (sentenceVarietyFactor * 5);

    return Math.min(98, Math.max(60, potential));
  }

  /**
   * Calculate standard deviation of an array of numbers
   * @param {Array<number>} values - Array of numbers
   * @returns {number} Standard deviation
   */
  calculateStandardDeviation(values) {
    if (values.length === 0) return 0;

    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  }
}

// Export the tokenizer
window.GoldenRatioTokenizer = GPT2Tokenizer;
