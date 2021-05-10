import type {
  Node as TRPGEditorNode,
  Editor,
  BaseEditor,
  Descendant,
} from 'slate';
import type { HistoryEditor } from 'slate-history';
import type { ReactEditor } from 'slate-react';

export type TRPGEditorValue = Descendant;

export interface EditorBaseProps {
  value: TRPGEditorValue[];
  onChange: (val: TRPGEditorValue[]) => void;
}

export type SlatePluginFunction<PluginEditor extends Editor = Editor> = <
  InputEditor extends Editor
>(
  editor: InputEditor
) => InputEditor & PluginEditor;

export type FormattedText = {
  bold?: boolean;
  code?: boolean;
  italic?: boolean;
  underline?: boolean;
  text: string;
};

export type FormatType =
  | 'heading-one'
  | 'heading-two'
  | 'heading-three'
  | 'block-quote'
  | 'numbered-list'
  | 'bulleted-list';

export type TRPGEditorText = FormattedText;

export type BlockTextElement = {
  type: FormatType | 'paragraph' | 'list-item';
  children: TRPGEditorText[];
};

export type ImageElement = {
  type: 'image';
  url: string;
  children: TRPGEditorText[];
};

export type MentionElement = {
  type: 'mention';
  data: any;
  children: TRPGEditorText[];
};

export type LinkElement = {
  type: 'link';
  url: string;
  children: TRPGEditorText[];
};

export type TRPGEditor = BaseEditor & ReactEditor & HistoryEditor;
export type TRPGEditorElement =
  | BlockTextElement
  | ImageElement
  | MentionElement
  | LinkElement;

declare module 'slate' {
  interface CustomTypes {
    Editor: TRPGEditor;
    Element: TRPGEditorElement;
    Text: TRPGEditorText;
  }
}

export type { TRPGEditorNode };
