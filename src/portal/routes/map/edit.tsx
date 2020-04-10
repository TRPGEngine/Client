import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { TiledMap } from '@shared/components/tiledmap';
import { RouteComponentProps } from 'react-router-dom';
import { fetchGroupActorList, GroupActorItem } from '@portal/model/group';
import _isNil from 'lodash/isNil';
import _isFunction from 'lodash/isFunction';
import SplitPane from '@shared/components/web/SplitPane';
import { Collapse, List, Button, Popover, InputNumber } from 'antd';
import Avatar from '@web/components/Avatar';
import { handleError } from '@portal/utils/error';
import { PlusOutlined } from '@ant-design/icons';
import { TiledMapManager } from '@shared/components/tiledmap/core/manager';
import { ActorToken } from '@shared/components/tiledmap/layer/token/ActorToken';

const Panel = Collapse.Panel;

const AppendTokenAction: React.FC<{
  onConfirm: (x: number, y: number) => void;
}> = React.memo((props) => {
  const [visible, setVisible] = useState(false);
  const [x, setX] = useState(1);
  const [y, setY] = useState(1);

  const handleConfirm = useCallback(() => {
    _isFunction(props.onConfirm) && props.onConfirm(x - 1, y - 1);
    setVisible(false);
  }, [x, y, props.onConfirm, setVisible]);

  const width = 20;
  const height = 20;

  const content = useMemo(() => {
    return (
      <div>
        <InputNumber
          value={x}
          onChange={setX}
          min={1}
          max={width + 1}
          precision={0}
        />
        <span>,</span>
        <InputNumber
          value={y}
          onChange={setY}
          min={1}
          max={height + 1}
          precision={0}
        />
        <div>
          <Button type="link" onClick={handleConfirm}>
            确认
          </Button>
        </div>
      </div>
    );
  }, [x, y, setX, setY, handleConfirm]);

  return (
    <Popover
      placement="left"
      title="添加到地图"
      content={content}
      trigger="click"
      visible={visible}
      onVisibleChange={setVisible}
    >
      <Button shape="circle" icon={<PlusOutlined />} />
    </Popover>
  );
});

interface Props
  extends RouteComponentProps<{
    groupUUID: string;
    mapUUID: string;
  }> {}
const MapEditor: React.FC<Props> = React.memo((props) => {
  const { groupUUID, mapUUID } = props.match.params;
  const [actors, setActors] = useState<GroupActorItem[]>([]);
  const tiledMapManagerRef = useRef<TiledMapManager>();

  useEffect(() => {
    if (_isNil(groupUUID)) {
      console.warn('没有获取到团UUID');
      return;
    }
    fetchGroupActorList(groupUUID)
      .then((list) => setActors(list))
      .catch(handleError);
  }, []);

  const handleAddToken = useCallback(
    (actor: GroupActorItem, x: number, y: number) => {
      // TODO
      console.log(actor, x, y);
      const groupActorUUID = actor.uuid;

      const actorToken = new ActorToken();
      actorToken.groupActorUUID = groupActorUUID;
      actorToken.gridPosition = { x, y };
      actorToken.buildPromise();

      const manager = tiledMapManagerRef.current;
      manager.addToken(manager.getDefaultLayer().id, actorToken);
    },
    []
  );

  const handleLoad = useCallback((manager: TiledMapManager) => {
    console.log('manager', manager); // for debug
    tiledMapManagerRef.current = manager;
  }, []);

  const tiledMapEl = useMemo(
    () => <TiledMap mapUUID={mapUUID} mode="edit" onLoad={handleLoad} />,
    [mapUUID]
  );

  const tokenPickerEl = useMemo(
    () => (
      <Collapse defaultActiveKey="actors">
        <Panel key="actors" header="人物卡">
          <List
            itemLayout="horizontal"
            dataSource={actors}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <AppendTokenAction
                    onConfirm={(x, y) => handleAddToken(item, x, y)}
                  />,
                ]}
              >
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
