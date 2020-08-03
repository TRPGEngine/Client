import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { Avatar } from '@web/components/Avatar';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { Typography, Badge } from 'antd';

const Container = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 4px;
  height: 42px;
  padding: 0 8px;

  &:hover,
  &.active {
    background-color: ${(props) => props.theme.color.transparent90};
  }
`;

interface SidebarItemProps {
  icon?: string | React.ReactElement;
  name: string;
  to: string;
  badge?: boolean | number;
}
export const SidebarItem: React.FC<SidebarItemProps> = TMemo((props) => {
  const { icon, name, to, badge } = props;
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link to={to}>
      <Container className={isActive ? 'active' : ''}>
        <div style={{ marginRight: 8 }}>
          {React.isValidElement(icon) ? (
            icon
          ) : (
            <Avatar src={icon} name={name} />
          )}
        </div>

        <Typography style={{ flex: 1 }}>{name}</Typography>

        {badge === true ? (
          <Badge status="error" />
        ) : (
          <Badge count={Number(badge) || 0} />
        )}
      </Container>
    </Link>
  );
});
SidebarItem.displayName = 'SidebarItem';
