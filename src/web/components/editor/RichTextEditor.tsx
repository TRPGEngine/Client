import React, { useState, useCallback, useMemo } from 'react';
import {
  Editable,
  useSlate,
  Slate,
  RenderLeafProps,
  RenderElementProps,
} from 'slate-react';
import { Editor, Transforms, Node } from 'slate';
import { TMemo } from '@shared/components/TMemo';
import { ToolbarButton, Toolbar } from './style';
import { createFullEditor } from './instance';
import styled from 'styled-components';
import { Iconfont } from '../Iconfont';
import isHotkey from 'is-hotkey';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const isSaveHotkey = isHotkey('mod+s');

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const EditArea = styled(Editable).attrs({
  spellCheck: true,
  autoFocus: true,
  // placeholder: '请输入文本', // NOTE: 这里不使用placeholder的原因是有默认占位符下使用输入法会导致崩溃
})`
  flex: 1;
  overflow: auto;
  padding: 0 10px;
`;

interface RichTextEditorProps {
  value: Node[];
  onChange: (val: Node[]) => void;
  onBlur?: () => void;
  onSave?: () => void;
}
export const RichTextEditor: React.FC<RichTextEditorProps> = TMemo((props) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => createFullEditor(), []);

  return (
    <Container>
      <Slate editor={editor} value={props.value} onChange={props.onChange}>
        <Toolbar>
          <MarkButton format="bold" icon={<Iconfont>&#xe62d;</Iconfont>} />
          <MarkButton format="italic" icon={<Iconfont>&#xe636;</Iconfont>} />
          <MarkButton format="underline" icon={<Iconfont>&#xe633;</Iconfont>} />
          <MarkButton format="code" icon={<Iconfont>&#xe630;</Iconfont>} />
          <BlockButton
            format="heading-one"
            icon={<Iconfont>&#xe646;</Iconfont>}
          />
          <BlockButton
            format="heading-two"
            icon={<Iconfont>&#xe644;</Iconfont>}
          />
          {/* <BlockButton format="block-quote" icon="format_quote" />
          <BlockButton format="numbered-list" icon="format_list_numbered" />
          <BlockButton format="bulleted-list" icon="format_list_bulleted" /> */}
        </Toolbar>
        <EditArea
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onBlur={props.onBlur}
          onKeyDown={(e) => {
            if (isSaveHotkey(e.nativeEvent)) {
              e.preventDefault();
              props.onSave?.();
            }
          }}
        />
      </Slate>
    </Container>
  );
});
RichTextEditor.displayName = 'RichTextEditor';

const toggleBlock = (editor, format) => {
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

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format) => {
  const [match] = Array.from(
    Editor.nodes(editor, {
      match: (n) => n.type === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element: React.FC<RenderElementProps> = ({
  attributes,
  children,
  element,
}) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <ToolbarButton
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </ToolbarButton>
  );
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <ToolbarButton
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </ToolbarButton>
  );
};

const initialValue: Node[] = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', bold: true },
      {
        text:
          ', or add a semantically rendered block quote in the middle of the page, like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Try it out for yourself!' }],
  },
];
