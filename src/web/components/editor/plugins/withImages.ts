import type { SlatePluginFunction } from '../types';

export const withInlineImages: SlatePluginFunction = (editor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === 'image' ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  return editor;
};
