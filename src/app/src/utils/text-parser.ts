import { emojify } from './emoji';
import bbcodeParser from './bbcode-parser';
import urlRegex from 'url-regex';

/**
 * 解析文本
 * @param {string} plainText 服务端标准文本
 */
export function parse(plainText: string) {
  return bbcodeParser.parse(preProcessText(plainText));
}

/**
 * 客户端预处理文本
 * @param plainText 服务端文本
 */
export function preProcessText(plainText: string): string {
  let text = emojify(plainText); // 将:<emojicode>: 转化为 unicode字符
  text = text.replace(
    new RegExp(urlRegex({ exact: false, strict: true }), 'g'),
    '[url]$&[/url]'
  ); // 将聊天记录中的url提取成bbcode
  return text;
}
