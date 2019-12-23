import React from 'react';
import XMLBuilder, { DataMap } from '@src/shared/layout/XMLBuilder';
import { on, off, postMessage } from '@portal/utils/event';
const exampleXml = require('@shared/layout/example/wuxian-layout.xml').default;

/**
 * TODO
 * 测试文件，待删除
 */

class ActorEditor extends React.Component {
  actorData: DataMap = {};
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
