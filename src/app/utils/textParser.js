import { emojify } from './emoji';
import bbcodeParser from './bbcodeParser';

/**
 * 解析文本
 * @param {string} plainText 服务端标准文本
 */
export function parse(plainText) {
  return bbcodeParser.parse(emojify(plainText));
}
