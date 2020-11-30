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

export const MsgItemTip = styled.div`
  text-align: center;
  margin: 10px 0;

  .content {
    display: inline-block;
    background-color: ${(props) => props.theme.color.transparent80};
    color: ${({ theme }) =>
      theme.mixins.modeValue([
        theme.color['dove-gray'],
        theme.color['silver'],
      ])};
    max-width: 360px;
    margin: auto;
    overflow: hidden;
    border-radius: 5px;
    word-break: break-all;
    padding: 6px 12px;
    font-size: 12px;
    vertical-align: middle;
  }
`;

export const DefaultAddonContentContainer = styled.a`
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

export const MsgItem = styled.div`
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${(props) => props.theme.color['mine-shaft']};

  &:hover > .profile .time {
    visibility: visible;
  }

  &.me {
    .profile,
    .content {
      flex-direction: row-reverse;
    }

    .content {
      .avatar {
        margin-right: 0;
        margin-left: 7px;
      }

      > .body {
        margin-right: 0;
        margin-left: 140px;
        flex-direction: row-reverse;

        .bubble {
          float: right;
        }
      }
    }
  }

  &.ooc,
  &.speak,
  &.action {
    .content > .body > .bubble {
      padding-left: 22px;
      padding-right: 22px;
    }
  }

  &.ooc {
    .content > .body > .bubble {
      color: #ccc;
      border-style: dashed;

      &:before {
        content: '(';
        position: absolute;
        top: 4px;
        left: 14px;
      }
      &:after {
        content: ')';
        position: absolute;
        bottom: 6px;
        right: 14px;
      }
    }
  }

  &.speak {
    .content > .body > .bubble {
      border-color: #bec9ff;
      box-shadow: 0px 0px 2px 0px #bec9ff;
      &:before {
        content: '\\e605';
        top: 0;
        left: 6px;
      }
      &:after {
        content: '\\e601';
        bottom: 13px;
        right: 6px;
      }
      &:before,
      &:after {
        font-family: 'iconfont';
        color: #ccc;
        position: absolute;
        font-size: 12px;
      }
    }
  }

  &.action {
    & .content > .body > .bubble {
      border-color: #ffa787;
      box-shadow: 0px 0px 2px 0px #ffa787;

      &:before {
        content: '\\e619';
        font-family: 'iconfont';
        color: #ccc;
        position: absolute;
        right: 6px;
      }
    }

    &.me .content > .body > .bubble {
      &:before {
        position: absolute;
        left: 6px;
        right: auto;
      }
    }
  }

  &.card {
    & .content > .body > .bubble {
      padding: 0;
      min-width: 220px;
      max-width: 467px;

      > .card-title {
        ${(props) => props.theme.mixins.oneline};
        color: white;
        line-height: 30px;
        padding: 0 6px;
        background-color: ${(props) => props.theme.color['tan']};
      }

      > .card-content {
        padding: 10px 6px;
        color: ${(props) => props.theme.color['tundora']};
        min-height: 60px;
      }

      > .card-action {
        margin: 0 6px;
        padding: 4px 0;
        border-top: 1px solid ${(props) => props.theme.color['bon-jour']};

        button {
          ${(props) => props.theme.mixins.linkBtn};
        }

        .no-support {
          color: ${(props) => props.theme.color['dusty-gray']};
          font-size: 12px;
          user-select: none;
        }
      }

      > .card-content-actor {
        padding: 10px;
        max-height: 160;
        display: flex;

        > .card-content-avatar {
          display: flex;
          width: 60px;
          height: 60px;
          flex-shrink: 0;
          overflow: hidden;
          align-items: center;
          justify-content: center;
          background-position: center;
          background-size: cover;
          font-size: 24px;
        }

        > .card-content-profile {
          flex: 1;
          padding: 0 10px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          > h3 {
            margin: 0;
            margin-bottom: 4px;
            ${(props) => props.theme.mixins.oneline};
          }

          > p {
            margin: 0;
            flex: 1;
            ${(props) => props.theme.mixins.autoScrollBar};
          }
        }
      }
    }
  }

  &.file {
    .content > .body > .bubble {
      width: 260px;

      .file-info {
        display: flex;
        padding: 7px 0;

        .file-avatar {
          margin-right: 10px;
          width: 50px;
          height: 50px;
          border-radius: 3px;
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
          overflow: hidden;
        }

        .file-prop {
          flex: 1;
          overflow: hidden;
          h3 {
            ${(props) => props.theme.mixins.oneline};
            display: inline-block;
            width: 100%;
            color: #333;
            cursor: pointer;
            font-size: 16px;
            font-weight: normal;
            margin: 0;
          }

          p {
            color: ${(props) => props.theme.color['silver']};
            line-height: 18px;
          }
        }
      }

      .file-progress {
        width: 100%;
        padding-bottom: 10px;

        > div {
          border-top: 3px solid ${(props) => props.theme.color['tan']};
          transition: width 0.4s;
        }
      }

      .file-action {
        display: flex;
        margin-top: 10px;
        border-top: 1px solid ${(props) => props.theme.color['silver']};

        button {
          ${(props) => props.theme.mixins.linkBtn};
          flex: 1;
          border-right: 1px solid ${(props) => props.theme.color['silver']};

          &:last-child {
            border-right: 0;
          }

          &:after {
            content: none !important;
          }
        }
      }
    }
  }

  .profile {
    padding: 0 45px;
    margin: 2px 0;
    display: flex;
    flex-direction: row;
    align-items: center;

    .name {
      ${(props) => props.theme.mixins.oneline};
      color: #8e97a1;
      max-width: 180px;
      word-wrap: normal;
      font-size: 12px;
    }
    .time {
      visibility: hidden;
      color: ${(props) => props.theme.color['silver-sand']};
      font-size: 12px;
      margin: 0 6px;
    }
  }

  .content {
    display: flex;
    flex-direction: row;

    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 7px;

      > img {
        width: 100%;
        height: 100%;
      }
    }

    > .body {
      flex: 1;
      margin-right: 140px;
      display: flex;

      ${(props) => props.theme.mixins.mobile('margin: 0 !important;')}

      .bubble {
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
      }

      > .loading {
        align-self: flex-end;
      }

      > .operation {
        border: 1px solid #e1e0e4;
        color: #e1e0e4;
        border-radius: 3px;
        align-self: flex-end;
        margin: 0 4px;
        height: 16px;
        width: 18px;
        display: flex;
        align-items: center;
        cursor: pointer;
        overflow: hidden;
        position: relative;
        visibility: hidden;

        > .iconfont {
          font-size: 8px;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          text-align: center;
          line-height: normal;
        }
      }

      &:hover > .operation {
        visibility: visible;
      }
    }
  }

  &.compact:not(.card) {
    .content {
      .avatar {
        margin-top: -16px;
      }

      .bubble {
        border: 0;
        background-color: transparent;
        color: ${({ theme }) => theme.color.textNormal};
        padding: 0;
        border-radius: initial;
        box-shadow: none;

        &::before,
        &::after {
          content: '';
        }
      }
    }
  }

  &.omitSenderInfo {
    margin-top: 10px;
  }
`;
