import React from 'react';
import styled from 'styled-components';

type BlockThemeType = 'dark' | 'light';

const BlockContent = styled.div<{ type: BlockThemeType }>`
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;

  > h2 {
    margin: 0;
    padding: 0.5rem 2rem;
    height: 50px;
    background-color: ${(props) => (props.type === 'dark' ? '#333' : '#eee')};
    color: ${(props) => (props.type === 'dark' ? 'white' : 'black')};
    font-size: 16px;
    border-bottom: 1px solid
      ${(props) => (props.type === 'dark' ? '#111' : '#efefef')};
    display: flex;
    align-items: center;

    > span {
      margin-right: 8px;
    }
  }

  > div {
    flex: 1;
    overflow: auto;
  }
`;

interface Props {
  label: string;
  theme: BlockThemeType;
  actions?: React.ReactNode;
}

export const Block: React.FC<Props> = React.memo((props) => {
  return (
    <BlockContent type={props.theme}>
      <h2>
        <span>{props.label}</span>
        {props.actions}
      </h2>
      <div>{props.children}</div>
    </BlockContent>
  );
});
