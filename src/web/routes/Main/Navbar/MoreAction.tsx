import React, { useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Iconfont } from '@web/components/Iconfont';
import { FullModal } from '@web/components/FullModal';
import { SettingView } from './SettingView';

export const MoreAction: React.FC = TMemo((props) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Iconfont onClick={() => setVisible(true)}>&#xe625;</Iconfont>

      <FullModal visible={visible} onChangeVisible={setVisible}>
        <SettingView />
      </FullModal>
    </div>
  );
});
MoreAction.displayName = 'MoreAction';
