import React, { useCallback, useMemo } from 'react';
import { Slate } from 'slate-react';
import { TMemo } from '@shared/components/TMemo';
import { ToolbarButton, Toolbar } from './style';
import { createStandardEditor } from './instance';
import styled from 'styled-components';
import { Iconfont } from '../Iconfont';
import { isSaveHotkey, isTabHotkey } from '@web/utils/hot-key';
import indentLines from './changes/indentLines';
import { useBeforeUnload } from 'react-use';
import { BlockButton } from './toolbar/BlockButton';
import { MarkButton } from './toolbar/MarkButton';
import { SlateLeaf } from './render/Leaf';
import { SlateElement } from './render/Element';
import { EditArea } from './render/EditArea';
import { EditorBaseProps } from './types';
import { WebErrorBoundary } from '../WebErrorBoundary';

interface CustomAction {
  icon: React.ReactNode;
  action: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

interface RichTextEditorProps extends EditorBaseProps {
  style?: React.CSSProperties;
  customActions?: CustomAction[];
  onBlur?: () => void;
  onSave?: () => void;
}
export const RichTextEditor: React.FC<RichTextEditorProps> = TMemo((props) => {
  const renderElement = useCallback((props) => <SlateElement {...props} />, []);
  const renderLeaf = useCallback((props) => <SlateLeaf {...props} />, []);
  const editor = useMemo(() => createStandardEditor(), []);
  useBeforeUnload(true, '确定要离开页面么? 未保存的笔记会丢失');

  return (
    <WebErrorBoundary>
      <Container style={props.style}>
        <Slate editor={editor} value={props.value} onChange={props.onChange}>
          <Toolbar>
            <MarkButton format="bold" icon={<Iconfont>&#xe62d;</Iconfont>} />
            <MarkButton format="italic" icon={<Iconfont>&#xe636;</Iconfont>} />
            <MarkButton
              format="underline"
              icon={<Iconfont>&#xe633;</Iconfont>}
            />
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
    </WebErrorBoundary>
  );
});
RichTextEditor.displayName = 'RichTextEditor';
