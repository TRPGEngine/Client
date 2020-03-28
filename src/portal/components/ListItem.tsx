import styled from 'styled-components';

export const ListItem = styled.div`
  padding: 10px;
  display: flex;
  border-bottom: ${(props) => props.theme.border.thin};

  div {
    flex: 1;
  }
`;
