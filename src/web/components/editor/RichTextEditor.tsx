import React, { useCallback, useMemo } from 'react';
import { Slate } from 'slate-react';
import { TMemo } from '@shared/components/TMemo';
import { ToolbarButton, Toolbar } from './style';
import { createStandardEditor } from './instance';
import styled from 'styled-components';
import { Iconfont } from '../Iconfont';
import { isSaveHotkey, isTabHotkey } from '@web/utils/hot-key';
import indentLines from './changes/indentLines';
import { BlockButton } from './toolbar/BlockButton';
import { MarkButton } from './toolbar/MarkButton';
import { EditArea } from './render/EditArea';
import type { EditorBaseProps } from './types';
import { WebErrorBoundary } from '../WebErrorBoundary';
import { useEditorRender } from './hooks/useEditorRender';
import { serializeToPlaintext } from './utils/serialize/plaintext';
import { t } from '@shared/i18n';

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
  customButton?: React.ReactNode;
  customActions?: CustomAction[];
  onBlur?: () => void;
  onSave?: () => void;
}
export const RichTextEditor: React.FC<RichTextEditorProps> = TMemo((props) => {
  const { renderElement, renderLeaf } = useEditorRender('richtext');
  const editor = useMemo(() => createStandardEditor(), []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isTabHotkey(e.nativeEvent)) {
        e.preventDefault();
        indentLines(editor);
      } else if (isSaveHotkey(e.nativeEvent)) {
        e.preventDefault();
        props.onSave?.();
      }
    },
    [props.onSave]
  );

  const wordCount = useMemo(() => {
    const str = serializeToPlaintext(props.value);
    return str.replace(/\s/g, '').length;
  }, [props.value]);

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
              format="heading-three"
              icon={<Iconfont>&#xe647;</Iconfont>}
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

            {props.customButton}

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

            <small>
              &nbsp;&nbsp;{t('字数统计')}: {wordCount}
            </small>
          </Toolbar>
          <EditArea
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onBlur={props.onBlur}
            onKeyDown={handleKeyDown}
          />
        </Slate>
      </Container>
    </WebErrorBoundary>
  );
});
RichTextEditor.displayName = 'RichTextEditor';
