import { Parser } from 'html-to-react';

/**
 * Document:
 * https://www.npmjs.com/package/html-to-react
 */
const parser = new Parser();

/**
 * 将 html 转换为适合展示的文本
 */
export function transformToDom(html: string): React.ReactNode {
  return parser.parse(html);
}
