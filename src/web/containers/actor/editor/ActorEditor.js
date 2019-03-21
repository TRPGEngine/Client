import React from 'react';
import styled from 'styled-components';
import parser from '../../../../shared/layout/parser';

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
  const xml =
    '<?xml version="1.0" encoding="utf-8"?>' +
    '<note importance="high" logged="true">' +
    '    <title>Happy</title>' +
    '    <todo>Work<div>asd</div></todo>' +
    '    <todo>Play</todo>' +
    '</note>';
  const js = parser(xml);

  return (
    <EditorContainer>
      ActorEditor: <pre>{JSON.stringify(js, null, 4)}</pre>
    </EditorContainer>
  );
};

export default ActorEditor;
