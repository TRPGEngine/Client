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
import { Collapse, List } from 'antd';
import Avatar from '@web/components/Avatar';
import { handleError } from '@portal/utils/error';
import { TiledMapManager } from '@shared/components/tiledmap/core/manager';
import { ActorToken } from '@shared/components/tiledmap/layer/token/ActorToken';
import { checkToken, getToken } from '@portal/utils/auth';
import { TMemo } from '@shared/components/TMemo';
import { ImageToken } from '@shared/components/tiledmap/layer/token/ImageToken';
import { AppendTokenAction } from './tools/actions/AppendTokenAction';
import { AppendImageTokenAction } from './tools/actions/AppendImageTokenAction';

const Panel = Collapse.Panel;

interface Props
  extends RouteComponentProps<{
    groupUUID: string;
    mapUUID: string;
  }> {}
const MapEditor: React.FC<Props> = TMemo((props) => {
  const { groupUUID, mapUUID } = props.match.params;
  const [jwt, setJWT] = useState<string>();
  const [actors, setActors] = useState<GroupActorItem[]>([]);
  const tiledMapManagerRef = useRef<TiledMapManager>();

  useEffect(() => {
    if (_isNil(groupUUID)) {
      console.warn('没有获取到团UUID');
      return;
    }

    checkToken()
      .then(() => getToken())
      .then((jwt) => setJWT(jwt));

    fetchGroupActorList(groupUUID)
      .then((list) => setActors(list))
      .catch(handleError);
  }, []);

  const handleAddActorToken = useCallback(
    (actor: GroupActorItem, x: number, y: number) => {
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

  const handleAddImageToken = useCallback(
    (imageUrl: string, x: number, y: number) => {
      const imageToken = new ImageToken();
      imageToken.imageSrc = imageUrl;
      imageToken.gridPosition = { x, y };
      imageToken.buildPromise();

      const manager = tiledMapManagerRef.current;
      manager.addToken(manager.getDefaultLayer().id, imageToken);
    },
    []
  );

  const handleLoad = useCallback((manager: TiledMapManager) => {
    console.log('manager', manager); // for debug
    tiledMapManagerRef.current = manager;
  }, []);

  const tiledMapEl = useMemo(
    () =>
      jwt && (
        <TiledMap mapUUID={mapUUID} jwt={jwt} mode="edit" onLoad={handleLoad} />
      ),
    [mapUUID, jwt]
  );

  const tokenPickerEl = useMemo(
    () => (
      <Collapse defaultActiveKey={['actors', 'other']}>
        <Panel key="actors" header="人物卡">
          <List
            itemLayout="horizontal"
            dataSource={actors}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <AppendTokenAction
                    onConfirm={(x, y) => handleAddActorToken(item, x, y)}
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
        <Panel key="other" header="其他">
          <List.Item
            actions={[
              <AppendImageTokenAction onConfirm={handleAddImageToken} />,
            ]}
          >
            <List.Item.Meta title="增加网络图片" />
          </List.Item>
        </Panel>
      </Collapse>
    ),
    [actors]
  );

  return (
    <SplitPane split="vertical" primary="second" defaultSize={300}>
      <div style={{ height: '100%' }}>{tiledMapEl}</div>
      <div>{tokenPickerEl}</div>
    </SplitPane>
  );
});
MapEditor.displayName = 'MapEditor';

export default MapEditor;
