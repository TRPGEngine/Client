import styled from 'styled-components';

export const PersonalSection = styled.div`
  height: ${(props) => props.theme.style.sectionHeight};
  position: relative;

  &::after {
    content: ' ';
    position: absolute;
    display: block;
    bottom: 1px;
    left: 0;
    right: 0;
    height: 1px;
    box-shadow: ${(props) => props.theme.boxShadow.elevationLow};
    z-index: 1;
    pointer-events: none;
  }
`;
