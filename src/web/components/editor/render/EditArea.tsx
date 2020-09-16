import { Editable } from 'slate-react';
import styled from 'styled-components';

export const EditArea = styled(Editable).attrs({
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

  code {
    font-family: monospace;
    background-color: rgba(255, 255, 255, 0.4);
    padding: 3px;
    border-radius: 3px;
  }
`;
