import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import styled from 'styled-components';
import { useCurrentUserInfo } from '@redux/hooks/user';
import { getUserName } from '@shared/utils/data-helper';
import { Divider, Space } from 'antd';
import { NavbarLink } from './NavbarLink';
import { MainContent } from './Content';
import { Iconfont } from '@web/components/Iconfont';

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
`;

const NavBar = styled.nav`
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  width: ${(props) => props.theme.style.navbarWidth};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: center;
  padding: 20px 10px;
  background-color: ${(props) => props.theme.style.navbarBackgroundColor};
`;

const NavbarSection = styled(Space).attrs({
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
  background-color: ${(props) => props.theme.style.contentBackgroundColor};
`;

const GroupsContainer = styled(NavbarSection)`
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
  const avatar = currentUserInfo.avatar;

  const sidebar = useMemo(
    () => (
      <NavBar>
        <NavbarSection>
          <NavbarLink src={avatar} name={name} to="/main/personal" />
        </NavbarSection>

        <Divider />

        <GroupsContainer>
          {groups.map((group) => (
            <NavbarLink
              key={group.uuid}
              src={group.avatar}
              name={group.name}
              to={`/main/group/${group.uuid}`}
            />
          ))}
          <NavbarLink
            icon={<Iconfont>&#xe604;</Iconfont>}
            name="添加团"
            to="/main/group/find"
          />
        </GroupsContainer>
      </NavBar>
    ),
    [avatar, name, groups]
  );

  return (
    <Root>
      {sidebar}
      <BaseContent>
        <MainContent />
      </BaseContent>
    </Root>
  );
});
MainRoute.displayName = 'MainRoute';
