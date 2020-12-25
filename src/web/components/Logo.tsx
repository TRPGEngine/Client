import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import Image from './Image';
import logoUrl from '../assets/img/logo@512.png';
import styled from 'styled-components';

const Root = styled.div`
  margin: auto;
  display: block;
`;

interface LogoProps {
  style?: React.CSSProperties;
}
export const Logo: React.FC<LogoProps> = TMemo(({ style }) => {
  return (
    <Root style={style}>
      <Image style={style} src={logoUrl} />
    </Root>
  );
});
Logo.displayName = 'Logo';
