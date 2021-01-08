import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

export const ToolbarButton = styled.span<{
  active?: boolean;
}>`
  display: block;
  cursor: pointer;
  color: #cccccc;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 3px;
  background-color: ${(props) =>
    props.active ? props.theme.color.transparent90 : 'transparent'};

  &:hover {
    background-color: ${(props) => props.theme.color.transparent90};
  }
`;

export const Portal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

export const Toolbar = styled.div`
  position: relative;
  padding: 10px 18px;
  margin: 0;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;

  & > * {
    display: inline-block;
  }

  & > * + * {
    margin-left: 2px;
  }
`;

export const PlaceholderContainer = styled.div`
  position: absolute;
  pointer-events: none;
  color: ${(props) => props.theme.color.interactiveNormal};
  padding: 0 14px;
  user-select: none;
`;

export const MentionListContainer = styled.div`
  bottom: -9999px;
  left: -9999px;
  position: absolute;
  z-index: 1;
  padding: 3px;
  background-color: #333;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
`;

export const MentionMatchedItem = styled.div`
  padding: 1px 3px;
  border-radius: 3px;
`;

export const MentionTagItem = styled.span`
  padding: 3px 3px 2px;
  margin: 0 1px;
  vertical-align: baseline;
  display: inline-block;
  border-radius: 4px;
  font-size: 0.9em;
  color: #7289da;
  background-color: rgba(255, 255, 255, 0.6);
  cursor: pointer;

  &:hover {
    color: #fff;
    background-color: #7289da;
  }
`;
