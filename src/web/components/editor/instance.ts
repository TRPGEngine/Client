import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { withMentions } from './plugins/withMentions';
import { withInlineImages } from './plugins/withImages';

/**
 * 构建标准的编辑器实例
 */
export function createStandardEditor() {
  return withInlineImages(withHistory(withReact(createEditor())));
}

/**
 * 创建用于消息输入的编辑器实例
 */
export function createMsgInputEditor() {
  return withMentions(createStandardEditor());
}
