import { Editor, Transforms, Range } from 'slate';
import { ReactEditor } from 'slate-react';
import { TRPGEditorNode } from '../types';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

/**
 * 创建一个空的slate数据对象
 */
export function buildBlankInputData(): TRPGEditorNode[] {
  return [
    {
      children: [{ text: '' }],
    },
  ];
}

/**
 * 获取文档开始位置
 */
export function getHeadSelection(): Range {
  return {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 0 },
  };
}

/**
 * 判定块级元素是否生效
 */
export const isBlockActive = (editor: ReactEditor, format: string) => {
  const [match] = Array.from(
    Editor.nodes(editor, {
      match: (n) => n.type === format,
    })
  );

  return !!match;
};

/**
 * 切换块级元素属性
 */
export const toggleBlock = (editor: ReactEditor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(n.type as string),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

/**
 * 判断标记是否生效
 */
export const isMarkActive = (editor: ReactEditor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

/**
 * 切换标记
 */
export const toggleMark = (editor: ReactEditor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
