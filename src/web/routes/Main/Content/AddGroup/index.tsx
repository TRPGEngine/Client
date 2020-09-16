import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { Iconfont } from '@web/components/Iconfont';
import { PillTabs } from '@web/components/PillTabs';
import { FindGroup } from './FindGroup';
import { Typography, Button } from 'antd';
import { GroupCreate } from '@web/components/modal/GroupCreate';
import { openModal, ModalWrapper } from '@web/components/Modal';
const { TabPane } = PillTabs;

const Root = styled.div`
  padding: 10px;
  width: 100%;
`;

export const AddGroup: React.FC = TMemo(() => {
  const handleCreateGroup = useCallback(() => {
    openModal(
      <ModalWrapper>
        <GroupCreate />
      </ModalWrapper>
    );
  }, []);

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
          <Typography.Title level={3}>创建您的团</Typography.Title>
          <Typography.Title level={4}>
            创建一个与您的好友自由互动的空间，不仅仅是跑团
          </Typography.Title>

          <Typography.Paragraph>
            完全免费且无上限。在TRPG Engine享受一切
          </Typography.Paragraph>
          <Button type="primary" onClick={handleCreateGroup}>
            创建团
          </Button>
        </TabPane>
      </PillTabs>
    </Root>
  );
});
AddGroup.displayName = 'AddGroup';
