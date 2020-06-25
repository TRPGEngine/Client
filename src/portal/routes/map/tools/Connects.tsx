import React, { useState, useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { registerMapConnectsUpdate } from '@shared/components/tiledmap/socket';
import { SocketInfo } from './SocketInfo';
import { Space } from 'antd';

interface Props {
  mapUUID: string;
}
export const Connects: React.FC<Props> = TMemo((props) => {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    registerMapConnectsUpdate(props.mapUUID, (socketIds) => {
      setIds(socketIds);
    });
  }, [props.mapUUID]);

  return (
    <div>
      <Space size={4}>
        {ids.map((socketId, i) => {
          return <SocketInfo key={socketId + i} socketId={socketId} />;
        })}
      </Space>
    </div>
  );
});
Connects.displayName = 'Connects';
