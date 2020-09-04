import styled from 'styled-components';

export const Bubble = styled.pre.attrs({
  className: 'bubble',
})`
  font-family: ${(props) => props.theme.font.normal};
  min-width: 0;
  padding: 5px 11px;
  border: 1px solid #e1e0e4;
  border-radius: 6px;
  background-color: #fff;
  line-height: 1.5;
  word-break: break-all;
  float: left;
  position: relative;
  overflow: hidden;
  align-self: center;

  img {
    max-width: 100%;
  }
`;

export const DefaultAddonContentContainer = styled.div`
  border-top: ${(props) => props.theme.border.thin};
  display: flex;
  padding: 4px 0;
  cursor: pointer;

  > .info {
    flex: 1;

    > p:nth-child(2) {
      color: ${(props) => props.theme.color.gray};
    }
  }

  > .icon {
    padding: 6px;
    align-self: center;

    > img {
      max-width: 96px !important;
      max-height: 48px;
      border-radius: ${(props) => props.theme.radius.card};
    }
  }
`;
