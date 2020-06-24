import React, { useState, useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { registerMapConnectsUpdate } from '@shared/components/tiledmap/socket';

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
      {ids.map((socketId, i) => {
        return <div key={socketId + i}>{socketId}</div>;
      })}
    </div>
  );
});
Connects.displayName = 'Connects';
