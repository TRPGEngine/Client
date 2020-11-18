import { Avatar } from '@web/components/Avatar';
import styled from 'styled-components';
import { TMemo } from '@shared/components/TMemo';
import { useLocation } from 'react-router';
import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';
import classNames from 'classnames';

const Container = styled.div`
  position: relative;

  .pill-indicator {
    position: absolute;
    top: 25px;
    left: -14px;
    margin-top: -4px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: white;
    transition: height 0.2s ease-in-out, margin-top 0.2s ease-in-out;
  }

  &:hover .pill-indicator {
    height: 20px;
    margin-top: -10px;
  }

  &.active .pill-indicator {
    height: 40px;
    margin-top: -20px;
  }
`;

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
  showIndicator?: boolean;
}
export const NavbarLink: React.FC<NavbarLinkProps> = TMemo((props) => {
  const { name, src, icon, to, showIndicator } = props;
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Tooltip title={name} placement="right" overlayStyle={{ fontSize: 16 }}>
      <Container
        className={classNames({
          active: isActive,
        })}
      >
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

        {showIndicator && <div className="pill-indicator" />}
      </Container>
    </Tooltip>
  );
});
NavbarLink.displayName = 'NavbarLink';
