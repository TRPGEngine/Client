import React from 'react';
import styled from 'styled-components';
import parser from '../../../../shared/layout/parser';
import exampleXml from '../../../../shared/layout/example/coc7-layout.xml';

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
  const js = parser(exampleXml);

  return (
    <EditorContainer>
      ActorEditor: <pre>{JSON.stringify(js, null, 4)}</pre>
    </EditorContainer>
  );
};

export default ActorEditor;
