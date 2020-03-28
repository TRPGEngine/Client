import styled from 'styled-components';

/**
 * 使容器在一个竖屏内展示
 * 移动优先
 */
export const PortraitContainer = styled.div`
  max-width: 414px; /* iphone8 */
  margin: auto;
`;
PortraitContainer.displayName = 'PortraitContainer';
