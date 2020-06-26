import TAvatar from './TComponent/TAvatar';
import styled from 'styled-components/native';

export const UserAvatar = styled(TAvatar).attrs((props) => ({
  width: 40,
  height: 40,
}))`
  margin: 0 4px;
`;
