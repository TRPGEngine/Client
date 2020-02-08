import React, { useState } from 'react';
import styled from 'styled-components';
import XMLBuilder from '@shared/components/layout/XMLBuilder';
const exampleXml = require('@shared/components/layout/example/coc7-layout.xml')
  .default;
import { Button } from 'antd';

const EditorContainer = styled.div`
  width: 80%;
  height: 80%;
  border-radius: 3px;
  background-color: white;
  padding: 10px;
  box-shadow: rgba(0, 0, 0, 0.15) 1px 4px 12px;
  overflow: auto;
`;

const ActorEditor = () => {
  const [builderState, setBuilderState] = useState({});

  return (
    <EditorContainer>
      <XMLBuilder
        xml={exampleXml}
        onChange={(newState) => {
          setBuilderState(newState);
        }}
      />
      <Button onClick={() => console.log('状态:', builderState)}>保存</Button>
    </EditorContainer>
  );
};

export default ActorEditor;
