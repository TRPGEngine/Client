import React from 'react';
import styled from 'styled-components';

const BlockContent = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;

  > h2 {
    margin: 0;
    padding: 0.5rem 2rem;
    background-color: #333;
    color: white;
    font-size: 16px;
    border-bottom: 1px solid #111;
    display: flex;
    align-items: center;

    > span {
      margin-right: 8px;
    }
  }
`;

interface Props {
  label: string;
  actions?: React.ReactNode;
}

export const Block: React.FC<Props> = React.memo((props) => {
  return (
    <BlockContent>
      <h2>
        <span>{props.label}</span>
        {props.actions}
      </h2>
      {props.children}
    </BlockContent>
  );
});
