import { Avatar } from '@web/components/Avatar';
import styled from 'styled-components';

export const SidebarAvatar = styled(Avatar).attrs({
  size: 50,
  style: {
    cursor: 'pointer',
  },
})`
  transition: border-radius 0.2s ease-in-out;

  &:hover {
    border-radius: 20%;
  }
`;
