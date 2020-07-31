import styled from 'styled-components';

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

export const ContentDetail = styled.div`
  flex: 1;
  background-color: ${(props) => props.theme.style.contentBackgroundColor};
  display: flex;
  flex-direction: column;
`;

export const Sidebar = styled.div`
  width: ${(props) => props.theme.style.sidebarWidth};
  background-color: ${(props) => props.theme.style.sidebarBackgroundColor};
`;

export const SidebarHeaderText = styled.div`
  display: flex;
  padding: 10px;
  height: 40px;
  font-weight: bold;
`;

export const SidebarItemsContainer = styled.div`
  padding: 8px;
`;
