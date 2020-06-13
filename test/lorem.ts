import { LoremIpsum } from 'lorem-ipsum';

/**
 * 生成占位符的方法
 */

export const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 4,
    min: 2,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});
