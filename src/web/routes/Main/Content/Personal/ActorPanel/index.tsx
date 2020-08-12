import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { PillTabs } from '@web/components/PillTabs';
import styled from 'styled-components';
import { t } from '@shared/i18n';
import { Button } from 'antd';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { showModal } from '@redux/actions/ui';
import ActorCreate from '@web/components/modal/ActorCreate';
const { TabPane } = PillTabs;

const PaneContainer = styled.div`
  padding: 10px 20px;
`;

export const ActorPanel: React.FC = TMemo(() => {
  const dispatch = useTRPGDispatch();

  const allActorPane = useMemo(
    () => (
      <TabPane tab={t('所有')} key="1">
        <PaneContainer>
          <div>所有</div>
        </PaneContainer>
      </TabPane>
    ),
    []
  );

  const createNewActorPanel = useMemo(
    () => (
      <TabPane tab={t('创建角色')} key="2">
        <PaneContainer>
          <Button onClick={() => dispatch(showModal(<ActorCreate />))} key="2">
            创建角色
          </Button>
        </PaneContainer>
      </TabPane>
    ),
    []
  );

  return (
    <PillTabs defaultActiveKey="1">
      {allActorPane}
      {createNewActorPanel}
    </PillTabs>
  );
});
ActorPanel.displayName = 'ActorPanel';
