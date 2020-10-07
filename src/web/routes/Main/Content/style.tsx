import styled from 'styled-components';

export const SidebarHeaderText = styled.div`
  display: flex;
  padding: 10px;
  height: 40px;
  font-weight: bold;
  ${(props) => props.theme.mixins.oneline};
`;

export const SidebarItemsContainer = styled.div`
  padding: 8px;
  flex: 1;
  overflow: auto;
`;
