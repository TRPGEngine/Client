import React, { useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Iconfont } from '@web/components/Iconfont';
import { FullModal } from '@web/components/FullModal';
import { SettingView } from './SettingView';
import { PortalRender } from '@web/utils/portal';

export const MoreAction: React.FC = TMemo((props) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Iconfont onClick={() => setVisible(true)}>&#xe625;</Iconfont>

      {visible && (
        <PortalRender>
          <FullModal visible={true} onChangeVisible={setVisible}>
            <SettingView />
          </FullModal>
        </PortalRender>
      )}
    </div>
  );
});
MoreAction.displayName = 'MoreAction';
