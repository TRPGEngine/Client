import styled from 'styled-components';

export const Iconfont = styled.i.attrs({
  className: 'iconfont',
})<{
  active?: boolean;
}>`
  color: ${(props) =>
    props.active === true ? props.theme.color.tacao : 'inherit'};
  cursor: ${(props) => (props.onClick ? 'pointer' : 'inherit')};
  font-size: inherit;
`;
Iconfont.displayName = 'Iconfont';
