import emoji from 'node-emoji';
import { getCodeList } from '@src/shared/utils/emojione';
import _forEach from 'lodash/forEach';

const codeList = getCodeList();

export const emojiMap = _forEach(codeList, (list, catalog, map) => {
  map[catalog] = list
    .filter((name) => emoji.hasEmoji(name))
    .map((name) => ({
      name,
      code: emoji.get(name),
    }));
});

export const emojiCatalog = [
  'people',
  'nature',
  'objects',
  'places',
  'symbols',
];

/**
 * 将带有emoji代码的文本转化为标准文本
 * @param {string} code 带有emoji代码的文本
 */
export function unemojify(code: string): string {
  return emoji.unemojify(code);
}

/**
 * 将待emoji代码的字符串转化为表情
 * @param {string} plainText 无格式字符串
 */
export function emojify(plainText: string): string {
  return emoji.emojify(plainText);
}
