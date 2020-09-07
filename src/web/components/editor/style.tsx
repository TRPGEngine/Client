import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

export const ToolbarButton = styled.span<{
  active?: boolean;
  reversed?: boolean;
}>`
  cursor: pointer;
  color: ${(props) =>
    props.reversed
      ? props.active
        ? 'white'
        : '#aaa'
      : props.active
      ? 'black'
      : '#ccc'};
`;

export const Menu = styled.div`
  & > * {
    display: inline-block;
  }
  & > * + * {
    margin-left: 15px;
  }
`;

export const Portal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

export const Toolbar = styled(Menu)`
  position: relative;
  padding: 10px 18px;
  margin: 0;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
`;

export const PlaceholderContainer = styled.div`
  position: absolute;
  pointer-events: none;
  color: ${(props) => props.theme.color.interactiveNormal};
  padding: 0 14px;
`;

export const MentionListContainer = styled.div`
  bottom: -9999px;
  left: -9999px;
  position: absolute;
  z-index: 1;
  padding: 3px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
`;

export const MentionMatchedItem = styled.div`
  padding: 1px 3px;
  border-radius: 3px;
`;
