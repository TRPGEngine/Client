import React, { useCallback, useMemo } from 'react';
import {
  Editable,
  Slate,
  RenderLeafProps,
  RenderElementProps,
} from 'slate-react';
import { TMemo } from '@shared/components/TMemo';
import { ToolbarButton, Toolbar } from './style';
import { createFullEditor } from './instance';
import styled from 'styled-components';
import { Iconfont } from '../Iconfont';
import { isSaveHotkey, isTabHotkey } from '@web/utils/hot-key';
import indentLines from './changes/indentLines';
import { useBeforeUnload } from 'react-use';
import { BlockButton } from './toolbar/BlockButton';
import { MarkButton } from './toolbar/MarkButton';
import { TRPGEditorNode } from './types';

interface CustomAction {
  icon: React.ReactNode;
  action: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const EditArea = styled(Editable).attrs({
  spellCheck: false,
  autoFocus: false,
  // placeholder: '请输入文本', // NOTE: 这里不使用placeholder的原因是有默认占位符下使用输入法会导致崩溃
})`
  flex: 1;
  overflow: auto;
  padding: 0 10px;

  blockquote {
    border-left: 2px solid #ddd;
    margin-left: 0;
    margin-right: 0;
    padding-left: 10px;
    color: #aaa;
    font-style: italic;
    margin-bottom: 0;
  }

  ul {
    list-style-type: decimal;
    padding-left: 26px;
    margin-bottom: 1em;
  }

  ol {
    list-style-type: disc;
    padding-left: 26px;
    margin-bottom: 1em;
  }

  li {
    list-style: inherit;
  }
`;

interface RichTextEditorProps {
  value: TRPGEditorNode[];
  onChange: (val: TRPGEditorNode[]) => void;
  style?: React.CSSProperties;
  customActions?: CustomAction[];
  onBlur?: () => void;
  onSave?: () => void;
}
export const RichTextEditor: React.FC<RichTextEditorProps> = TMemo((props) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => createFullEditor(), []);
  useBeforeUnload(true, '确定要离开页面么? 未保存的笔记会丢失');

  return (
    <Container style={props.style}>
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
          <BlockButton
            format="block-quote"
            icon={<Iconfont>&#xe639;</Iconfont>}
          />
          <BlockButton
            format="numbered-list"
            icon={<Iconfont>&#xe637;</Iconfont>}
          />
          <BlockButton
            format="bulleted-list"
            icon={<Iconfont>&#xe638;</Iconfont>}
          />

          {/* 自定义操作 */}
          {props.customActions?.map((item, i) => (
            <ToolbarButton
              key={i}
              onMouseDown={(event) => {
                event.preventDefault();
                item.action();
              }}
            >
              {item.icon}
            </ToolbarButton>
          ))}
        </Toolbar>
        <EditArea
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onBlur={props.onBlur}
          onKeyDown={(e) => {
            if (isTabHotkey(e.nativeEvent)) {
              e.preventDefault();
              indentLines(editor);
            } else if (isSaveHotkey(e.nativeEvent)) {
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
