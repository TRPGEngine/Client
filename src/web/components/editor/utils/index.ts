import { Editor, Transforms, Range, Element } from 'slate';
import type { FormatType, TRPGEditor, TRPGEditorValue } from '../types';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

/**
 * 创建一个空的slate数据对象
 */
export function buildBlankInputData(): TRPGEditorValue[] {
  return [
    {
      children: [{ text: '' }],
    } as TRPGEditorValue,
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
export const isBlockActive = (editor: TRPGEditor, format: FormatType) => {
  const [match] = Array.from(
    Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === format,
    })
  );

  return !!match;
};

/**
 * 切换块级元素属性
 */
export const toggleBlock = (editor: TRPGEditor, format: FormatType) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      LIST_TYPES.includes(n.type),
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
export const isMarkActive = (editor: TRPGEditor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

/**
 * 切换标记
 */
export const toggleMark = (editor: TRPGEditor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
