import React from 'react';
import XMLBuilder, { DataType } from '@src/shared/layout/XMLBuilder';
import { on, off, postMessage } from '../utils/event';
const exampleXml = require('@shared/layout/example/wuxian-layout.xml').default;

class ActorEditor extends React.Component {
  actorData: DataType = {};
  getActorData = () => {
    // 将数据发送到宿主页面
    postMessage('actor::actordata', { data: this.actorData });
  };

  componentDidMount() {
    on('actor::getActorData', this.getActorData);
    (window as any).getActorData = () => this.actorData;
  }

  componentWillMount() {
    off('actor::getActorData', this.getActorData);
    (window as any).getActorData = null;
  }

  render() {
    return (
      <div>
        <XMLBuilder
          xml={exampleXml}
          onChange={({ data }) => (this.actorData = data)}
        />
      </div>
    );
  }
}

export default ActorEditor;
