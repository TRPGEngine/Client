import bbcodeParser from './parser';
import type { AstNode } from './type';
import _isNil from 'lodash/isNil';
import { t } from '@shared/i18n';

function bbcodeNodeToPlainText(node: AstNode): string {
  if (_isNil(node)) {
    return '';
  }

  if (typeof node === 'string') {
    return String(node);
  } else {
    if (node.tag === 'img') {
      return t('[图片]');
    } else {
      return (node.content ?? [])
        .map((sub) => bbcodeNodeToPlainText(sub))
        .join('');
    }
  }
}

/**
 * 将 BBCode 转化为普通的字符串
 */
export function bbcodeToPlainText(bbcode: string): string {
  const ast = bbcodeParser.parse(bbcode);

  return ast.map(bbcodeNodeToPlainText).join('');
}
