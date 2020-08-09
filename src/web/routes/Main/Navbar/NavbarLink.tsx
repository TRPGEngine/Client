import { Avatar } from '@web/components/Avatar';
import styled from 'styled-components';
import { TMemo } from '@shared/components/TMemo';
import { useLocation } from 'react-router';
import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';

const NavbarAvtar = styled(Avatar).attrs({
  size: 50,
  style: {
    cursor: 'pointer',
  },
})`
  transition: border-radius 0.2s ease-in-out;

  &:hover,
  &.active {
    border-radius: 25%;
  }
`;
NavbarAvtar.displayName = 'NavbarAvtar';

const NavbarIcon = styled.div`
  width: 50px;
  height: 50px;
  font-size: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.color.downy};
  background-color: ${(props) => props.theme.color.graySet[8]};
  transition: border-radius 0.2s ease-in-out;

  &:hover,
  &.active {
    border-radius: 25%;
  }
`;

interface NavbarLinkProps {
  name: string;
  src?: string;
  icon?: React.ReactElement;
  to: string;
}
export const NavbarLink: React.FC<NavbarLinkProps> = TMemo((props) => {
  const { name, src, icon, to } = props;
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Tooltip title={name} placement="right" overlayStyle={{ fontSize: 16 }}>
      <Link to={to}>
        {React.isValidElement(icon) ? (
          <NavbarIcon className={isActive ? 'active' : ''}>{icon}</NavbarIcon>
        ) : (
          <NavbarAvtar
            className={isActive ? 'active' : ''}
            src={src}
            name={name}
          />
        )}
      </Link>
    </Tooltip>
  );
});
NavbarLink.displayName = 'NavbarLink';
