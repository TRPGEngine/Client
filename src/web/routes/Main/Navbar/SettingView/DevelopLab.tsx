import React, { useCallback, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Button, Typography } from 'antd';
import { JumpLogo } from '@web/components/JumpLogo';
import { getInstance } from '@shared/api/trpg.api';
import { showToasts } from '@shared/manager/ui';
import { GradientProgress } from '@web/components/GradientProgress';

export const MockReconnect: React.FC = TMemo(() => {
  const [loading, setLoading] = useState(false);

  const handleMockReconnect = useCallback(() => {
    const instance = getInstance();
    const socket = instance.socket;
    const oldSocketId = socket.id;
    socket.disconnect();
    setLoading(true);

    setTimeout(() => {
      // 10秒后自动重连
      socket.connect();
      socket.once('connect', () => {
        setLoading(false);
        const newSocketId = socket.id;
        showToasts(`Socket 连接成功: ${oldSocketId} => ${newSocketId}`);
      });
    }, 10000);
  }, []);

  return (
    <div>
      <Button type="primary" loading={loading} onClick={handleMockReconnect}>
        模拟断线重连
      </Button>
    </div>
  );
});
MockReconnect.displayName = 'MockReconnect';

export const DevelopLab: React.FC = TMemo(() => {
  return (
    <div>
      <Typography.Title level={3}>开发实验室</Typography.Title>

      <div>
        <JumpLogo />

        <MockReconnect />

        <GradientProgress progress={50} />
      </div>
    </div>
  );
});
DevelopLab.displayName = 'DevelopLab';
