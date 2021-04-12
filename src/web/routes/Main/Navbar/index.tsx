import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useCurrentUserInfo } from '@redux/hooks/user';
import { getUserName } from '@shared/utils/data-helper';
import { Divider, Space } from 'antd';
import { NavbarLink } from './NavbarLink';
import { Iconfont } from '@web/components/Iconfont';
import { useTRPGSelector } from '@redux/hooks/useTRPGSelector';
import { TMemo } from '@shared/components/TMemo';
import { MobileNavbarSwitch } from './MobileNavbarSwitch';
import { MoreAction } from './MoreAction';
import { VoiceStatus } from '@web/components/rtc/VoiceStatus';
import {
  useUnreadGroupMap,
  useUnreadPersonalConverse,
} from '@redux/hooks/chat';
import { HoverRotator } from '@web/components/HoverRotator';

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

const GroupsContainer = styled(NavbarSection)`
  flex: 1;
  margin: 0 -10px;
  padding: 0 10px;
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

const NavbarFooter = styled.div`
  font-size: 26px;
`;

export const MainNavbar: React.FC = TMemo(() => {
  const groups = useTRPGSelector((state) => state.group.groups);
  const currentUserInfo = useCurrentUserInfo();
  const name = getUserName(currentUserInfo);
  const hasPersonalUnread = useUnreadPersonalConverse();
  const groupUUIDs = useMemo(() => groups.map((group) => group.uuid), [groups]);
  const groupUnreadMap = useUnreadGroupMap(groupUUIDs);
  const avatar = currentUserInfo.avatar;

  return (
    <NavBar>
      <MobileNavbarSwitch />

      <NavbarSection>
        <NavbarLink
          src={avatar}
          name={name}
          to="/main/personal"
          showIndicator={hasPersonalUnread === true}
        />
      </NavbarSection>

      <VoiceStatus />

      <Divider />

      <GroupsContainer>
        {groups.map((group) => (
          <NavbarLink
            key={group.uuid}
            src={group.avatar}
            name={group.name}
            to={`/main/group/${group.uuid}`}
            showIndicator={groupUnreadMap[group.uuid] === true}
          />
        ))}
        <NavbarLink
          icon={
            <HoverRotator>
              <Iconfont>&#xe604;</Iconfont>
            </HoverRotator>
          }
          name="添加团"
          to="/main/group/add"
        />
      </GroupsContainer>

      <NavbarFooter>
        <MoreAction />
      </NavbarFooter>
    </NavBar>
  );
});
MainNavbar.displayName = 'MainNavbar';
