import React from 'react';
import XMLBuilder from '@src/shared/layout/XMLBuilder';
const exampleXml = require('@shared/layout/example/coc7-layout.xml').default;

class ActorEditor extends React.Component {
  render() {
    return (
      <div>
        <XMLBuilder xml={exampleXml} />
      </div>
    );
  }
}

export default ActorEditor;
