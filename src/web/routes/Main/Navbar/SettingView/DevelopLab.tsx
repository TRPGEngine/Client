import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Typography } from 'antd';
import { JumpLogo } from '@web/components/JumpLogo';

export const DevelopLab: React.FC = TMemo(() => {
  return (
    <div>
      <Typography.Title level={3}>开发实验室</Typography.Title>

      <div>
        <JumpLogo />
      </div>
    </div>
  );
});
DevelopLab.displayName = 'DevelopLab';
