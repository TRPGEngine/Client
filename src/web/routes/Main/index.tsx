import React, { useMemo, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import styled from 'styled-components';
import { useCurrentUserInfo } from '@redux/hooks/user';
import { getUserName } from '@shared/utils/data-helper';
import config from '@shared/project.config';
import { Divider, Space } from 'antd';
import { SidebarAvatar } from './SidebarAvatar';
import { MainContentType } from './Content/type';
import { MainContent } from './Content';
import { GroupSelectedContext } from './GroupSelectedContext';

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
`;

const SideBar = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  width: 72px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: center;
  padding: 20px 10px;
  background-color: ${(props) => props.theme.color.graySet[8]};
`;

const SidebarSection = styled(Space).attrs({
  direction: 'vertical',
})`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BaseContent = styled.div`
  display: flex;
  overflow: hidden;
  position: absolute;
  left: 72px;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: ${(props) => props.theme.color.graySet[7]};
`;

const GroupsContainer = styled(SidebarSection)`
  flex: 1;
  overflow: hidden;

  &:hover {
    overflow: auto;
    overflow: overlay;
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
`;

export const MainRoute: React.FC = TMemo(() => {
  const groups = useTRPGSelector((state) => state.group.groups);
  const currentUserInfo = useCurrentUserInfo();
  const name = getUserName(currentUserInfo);
  const avatar = currentUserInfo.avatar ?? config.defaultImg.getUser(name);
  const [componentType, setComponentType] = useState<MainContentType>('init');
  const [groupUUID, setGroupUUID] = useState<string>(null);

  const sidebar = useMemo(
    () => (
      <SideBar>
        <SidebarSection>
          <div onClick={() => setComponentType('personal')}>
            <SidebarAvatar src={avatar} name={name} size={50} />
          </div>
        </SidebarSection>

        <Divider />

        <GroupsContainer>
          {groups.map((group) => (
            <div
              key={group.uuid}
              onClick={() => {
                setComponentType('group');
                setGroupUUID(group.uuid);
              }}
            >
              <SidebarAvatar src={group.avatar} name={group.name} />
            </div>
          ))}
        </GroupsContainer>
      </SideBar>
    ),
    [avatar, name, groups]
  );

  return (
    <Root>
      {sidebar}
      <BaseContent>
        <GroupSelectedContext.Provider value={{ uuid: groupUUID }}>
          <MainContent type={componentType} />
        </GroupSelectedContext.Provider>
      </BaseContent>
    </Root>
  );
});
MainRoute.displayName = 'MainRoute';
