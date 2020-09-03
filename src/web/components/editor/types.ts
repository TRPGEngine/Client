import { Node as TRPGEditorNode, Editor } from 'slate';

export interface EditorBaseProps {
  value: TRPGEditorNode[];
  onChange: (val: TRPGEditorNode[]) => void;
}

export type SlatePluginFunction<PluginEditor extends Editor = Editor> = <
  InputEditor extends Editor
>(
  editor: InputEditor
) => InputEditor & PluginEditor;

export { TRPGEditorNode };
