import styled from 'styled-components';

export const Iconfont = styled.i.attrs({
  className: 'iconfont',
})`
  color: inherit;
  cursor: ${(props) => (props.onClick ? 'pointer' : 'inherit')};
  font-size: inherit;
`;
