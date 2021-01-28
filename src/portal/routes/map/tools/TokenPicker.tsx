import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Collapse, List } from 'antd';
import Avatar from '@web/components/Avatar';
import { AppendTokenAction } from './actions/AppendTokenAction';
import { AppendImageTokenAction } from './actions/AppendImageTokenAction';
import { ActorToken } from '@shared/components/tiledmap/layer/token/ActorToken';
import type { TiledMapManager } from '@shared/components/tiledmap/core/manager';
import { ImageToken } from '@shared/components/tiledmap/layer/token/ImageToken';
import type { GroupActorItem } from '@shared/types/group';

const Panel = Collapse.Panel;

interface Props {
  actors: GroupActorItem[];
  tiledMapManagerRef: React.MutableRefObject<TiledMapManager | undefined>;
}
export const TokenPicker: React.FC<Props> = TMemo((props) => {
  const tiledMapManagerRef = props.tiledMapManagerRef;

  const handleAddActorToken = useCallback(
    (actor: GroupActorItem, x: number, y: number) => {
      const groupActorUUID = actor.uuid;

      const actorToken = new ActorToken();
      actorToken.groupActorUUID = groupActorUUID;
      actorToken.gridPosition = { x, y };
      actorToken.buildPromise();

      const manager = tiledMapManagerRef.current!;
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

      const manager = tiledMapManagerRef.current!;
      manager.addToken(manager.getDefaultLayer().id, imageToken);
    },
    []
  );

  return (
    <Collapse defaultActiveKey={['actors', 'other']}>
      <Panel key="actors" header="人物卡">
        <List
          itemLayout="horizontal"
          dataSource={props.actors}
          renderItem={(item) => (
            <List.Item
              actions={[
                <AppendTokenAction
                  key="token"
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
            <AppendImageTokenAction
              key="imageToken"
              onConfirm={handleAddImageToken}
            />,
          ]}
        >
          <List.Item.Meta title="增加网络图片" />
        </List.Item>
      </Panel>
    </Collapse>
  );
});
TokenPicker.displayName = 'TokenPicker';
