import React, {
  useCallback,
  useMemo,
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { TMemo } from '@shared/components/TMemo';
import { SlateLeaf } from './render/Leaf';
import { SlateElement } from './render/Element';
import { createMsgInputEditor } from './instance';
import { Range, Editor, Transforms } from 'slate';
import { Slate, ReactEditor } from 'slate-react';
import { EditArea } from './render/EditArea';
import { EditorBaseProps, TRPGEditorNode } from './types';
import _isFunction from 'lodash/isFunction';
import _isString from 'lodash/isString';
import {
  isArrowUpHotkey,
  isArrowDownHotkey,
  isTabHotkey,
  isEnterHotkey,
  isEscHotkey,
} from '@web/utils/hot-key';
import { EditorMentionListContext } from './context/EditorMentionListContext';
import ReactDOM from 'react-dom';
import { insertMention } from './changes/insertMention';
import { checkMention } from './utils/checkMention';
import { serializeToPlaintext } from './utils/serialize/plaintext';
import { PlaceholderContainer } from './style';

const MentionsPortal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

interface MsgInputEditorProps extends EditorBaseProps {
  placeholder: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onEditor?: (editor: Editor) => void;
}

/**
 * 占位符相关实现
 */
function usePlaceholder(props: MsgInputEditorProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    if (!_isString(props.placeholder)) {
      return;
    }

    // 检测是否需要
    if (serializeToPlaintext(props.value) === '') {
      setShowPlaceholder(true);
    } else {
      setShowPlaceholder(false);
    }
  }, [props.placeholder, props.value]);
  const handleCompositionStart = useCallback(() => {
    if (showPlaceholder === true) {
      setShowPlaceholder(false);
    }
  }, [showPlaceholder]);
  const handleCompositionEnd = useCallback(() => {
    if (!_isString(props.placeholder)) {
      return;
    }

    if (showPlaceholder === false && serializeToPlaintext(props.value) === '') {
      setShowPlaceholder(true);
    }
  }, [showPlaceholder, props.placeholder, props.value]);

  const placeholderEl = (
    <>
      {props.placeholder && showPlaceholder && (
        <PlaceholderContainer>{props.placeholder}</PlaceholderContainer>
      )}
    </>
  );

  return { placeholderEl, handleCompositionStart, handleCompositionEnd };
}

export const MsgInputEditor: React.FC<MsgInputEditorProps> = TMemo((props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const renderElement = useCallback((props) => <SlateElement {...props} />, []);
  const renderLeaf = useCallback((props) => <SlateLeaf {...props} />, []);
  const editor = useMemo(() => createMsgInputEditor(), []);

  const [target, setTarget] = useState<Range | undefined>(undefined);
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');
  const mentionList = useContext(EditorMentionListContext);
  const chars = mentionList
    .map((val) => val.text)
    .filter((c) => c.toLowerCase().startsWith(search.toLowerCase()))
    .slice(0, 10);

  const handleChange = useCallback(
    (value: TRPGEditorNode[]) => {
      _isFunction(props.onChange) && props.onChange(value);
      const mention = checkMention(editor);

      if (mention) {
        setTarget(mention.target);
        setSearch(mention.searchText);
        setIndex(0);
      }

      setTarget(undefined);
    },
    [editor, props.onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      _isFunction(props.onKeyDown) && props.onKeyDown(e);

      if (target) {
        if (isArrowUpHotkey(e.nativeEvent)) {
          e.preventDefault();
          const nextIndex = index <= 0 ? chars.length - 1 : index - 1;
          setIndex(nextIndex);
        } else if (isArrowDownHotkey(e.nativeEvent)) {
          e.preventDefault();
          const prevIndex = index >= chars.length - 1 ? 0 : index + 1;
          setIndex(prevIndex);
        } else if (isTabHotkey(e.nativeEvent) || isEnterHotkey(e.nativeEvent)) {
          e.preventDefault();
          Transforms.select(editor, target);
          insertMention(editor, chars[index]);
          setTarget(undefined);
        } else if (isEscHotkey(e.nativeEvent)) {
          e.preventDefault();
          setTarget(undefined);
        }
      }
    },
    [index, search, target, props.onKeyDown]
  );

  useEffect(() => {
    const el = ref.current;
    if (target && el && chars.length > 0) {
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      el.style.top = `${rect.top + window.pageYOffset + 24}px`;
      el.style.left = `${rect.left + window.pageXOffset}px`;
    }
  }, [chars.length, editor, index, search, target]);

  useEffect(() => {
    _isFunction(props.onEditor) && props.onEditor(editor);
  }, [editor]);

  const {
    placeholderEl,
    handleCompositionStart,
    handleCompositionEnd,
  } = usePlaceholder(props);

  return (
    <Slate editor={editor} value={props.value} onChange={handleChange}>
      {placeholderEl}

      <EditArea
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      />

      {target && chars.length > 0 && (
        <MentionsPortal>
          <div
            ref={ref}
            style={{
              top: '-9999px',
              left: '-9999px',
              position: 'absolute',
              zIndex: 1,
              padding: '3px',
              background: 'white',
              borderRadius: '4px',
              boxShadow: '0 1px 5px rgba(0,0,0,.2)',
            }}
          >
            {chars.map((char, i) => (
              <div
                key={char}
                style={{
                  padding: '1px 3px',
                  borderRadius: '3px',
                  background: i === index ? '#B4D5FF' : 'transparent',
                }}
              >
                {char}
              </div>
            ))}
          </div>
        </MentionsPortal>
      )}
    </Slate>
  );
});
MsgInputEditor.displayName = 'MsgInputEditor';
