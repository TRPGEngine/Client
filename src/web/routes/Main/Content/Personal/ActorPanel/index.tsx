import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { PillTabs } from '@web/components/PillTabs';
import styled from 'styled-components';
import { Button } from 'antd';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { showModal } from '@redux/actions/ui';
import ActorCreate from '@web/components/modals/ActorCreate';
import { ActorList } from './ActorList';
import { useTranslation } from '@shared/i18n';
const { TabPane } = PillTabs;

const PaneContainer = styled.div`
  padding: 10px 20px;
`;

export const ActorPanel: React.FC = TMemo(() => {
  const dispatch = useTRPGDispatch();
  const { t } = useTranslation();

  const allActorPane = useMemo(
    () => (
      <TabPane tab={t('所有')} key="1">
        <PaneContainer>
          <Button onClick={() => dispatch(showModal(<ActorCreate />))} key="2">
            {t('创建新角色')}
          </Button>

          <ActorList />
        </PaneContainer>
      </TabPane>
    ),
    [t]
  );

  return <PillTabs defaultActiveKey="1">{allActorPane}</PillTabs>;
});
ActorPanel.displayName = 'ActorPanel';
