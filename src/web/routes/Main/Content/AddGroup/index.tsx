import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { Iconfont } from '@web/components/Iconfont';
import { PillTabs } from '@web/components/PillTabs';
import { FindGroup } from './FindGroup';
const { TabPane } = PillTabs;

const Root = styled.div`
  padding: 10px;
  width: 100%;
`;

export const AddGroup: React.FC = TMemo(() => {
  return (
    <Root>
      <PillTabs>
        <TabPane
          tab={
            <div>
              <Iconfont>&#xe958;</Iconfont> 搜索团
            </div>
          }
          key="1"
        >
          <FindGroup />
        </TabPane>
        <TabPane
          tab={
            <div>
              <Iconfont>&#xe61c;</Iconfont> 创建团
            </div>
          }
          key="2"
        >
          <div>创建团</div>
        </TabPane>
      </PillTabs>
    </Root>
  );
});
AddGroup.displayName = 'AddGroup';
