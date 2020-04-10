import React, { useEffect, useState, useMemo } from 'react';
import { TiledMap } from '@shared/components/tiledmap';
import { RouteComponentProps } from 'react-router-dom';
import { fetchGroupActorList, GroupActorItem } from '@portal/model/group';
import _isNil from 'lodash/isNil';
import SplitPane from '@shared/components/web/SplitPane';
import { Collapse, List } from 'antd';
import Avatar from '@web/components/Avatar';
import { handleError } from '@portal/utils/error';

const Panel = Collapse.Panel;

interface Props
  extends RouteComponentProps<{
    groupUUID: string;
    mapUUID: string;
  }> {}
const MapEditor: React.FC<Props> = React.memo((props) => {
  const { groupUUID, mapUUID } = props.match.params;
  const [actors, setActors] = useState<GroupActorItem[]>([]);

  useEffect(() => {
    if (_isNil(groupUUID)) {
      console.warn('没有获取到团UUID');
      return;
    }
    fetchGroupActorList(groupUUID)
      .then((list) => setActors(list))
      .catch(handleError);
  }, []);

  const tiledMapEl = useMemo(() => <TiledMap mapUUID={mapUUID} mode="edit" />, [
    mapUUID,
  ]);

  const tokenPickerEl = useMemo(
    () => (
      <Collapse defaultActiveKey="actors">
        <Panel key="actors" header="人物卡">
          <List
            itemLayout="horizontal"
            dataSource={actors}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar name={item.name} src={item.avatar} />}
                  title={<div>{item.name}</div>}
                  description={item.desc}
                />
              </List.Item>
            )}
          />
        </Panel>
      </Collapse>
    ),
    [actors]
  );

  return (
    <SplitPane split="vertical" primary="second" defaultSize={300}>
      <div>{tiledMapEl}</div>
      <div>{tokenPickerEl}</div>
    </SplitPane>
  );
});
MapEditor.displayName = 'MapEditor';

export default MapEditor;
