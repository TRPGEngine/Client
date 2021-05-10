import type { TRPGEditorNode } from '../../types';
import { Text, Editor } from 'slate';

/**
 * 序列化为标准HTML
 */
export function serializeToHtml(node: TRPGEditorNode): string {
  if (Text.isText(node)) {
    return node.text;
  }

  const children = node.children.map((n) => serializeToHtml(n)).join('');

  if (Editor.isEditor(node)) {
    return children;
  }

  switch (node.type) {
    case 'block-quote':
      return `<blockquote><p>${children}</p></blockquote>`;
    case 'paragraph':
      return `<p>${children}</p>`;
    case 'link':
      return `<a href="${node.url}">${children}</a>`;
    default:
      return children;
  }
}
