import React from 'react';
import { ActorType, ActorBaseAttr } from '@redux/types/actor';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { getAbsolutePath } from '@shared/utils/file-helper';

export const ActorCardContainer = styled.div`
  display: flex;
  width: 280px;
  height: 120px;
  background-color: white;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 14px;
  box-shadow: rgba(0, 0, 0, 0.15) 0 0 6px;
  border: 1px solid $color-bon-jour;
  padding: 10px 6px;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.5) 0 0 6px;
  }
`;

const Container = styled(ActorCardContainer)`
  .avatar {
    display: flex;
    height: 100%;
    width: 80px;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    border: 1px solid ${(props) => props.theme.color['bon-jour']};
    background-position: center;
    background-size: cover;

    img {
      width: 100%;
      height: auto;
    }
  }

  .profile {
    flex: 1;
    margin-left: 5px;
    font-size: 12px;
    display: flex;
    flex-direction: column;

    p {
      margin: 0;
      display: flex;
      height: auto;
      user-select: none;
      cursor: default;

      &:nth-child(2) {
        flex: 1;
      }

      span:nth-child(1) {
        color: ${(props) => props.theme.color['dove-gray']};
        word-break: keep-all;
        margin-right: 2px;
      }
      span:nth-child(2) {
        float: left;
        flex: 1;
        word-break: break-all;
        text-align: left;
        color: ${(props) => props.theme.color['cod-gray']};
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        max-height: 3 * 1.4em;
      }

      &.action {
        justify-content: flex-end;
        button {
          ${(props) => props.theme.mixins.linkBtn}
          font-size: 12px;

          .iconfont {
            font-size: 16px;
          }
        }
      }
    }
  }
`;

interface Props {
  actor: ActorBaseAttr;
  actions?: React.ReactNode;
  style?: React.CSSProperties;
}
export const ActorCard: React.FC<Props> = TMemo((props) => {
  const { actor, style } = props;

  const backgroundStyle = {
    backgroundImage: `url(${getAbsolutePath(actor.avatar)})`,
  };

  return (
    <Container className="actor-card" style={style}>
      <div className="avatar" style={backgroundStyle} />
      <div className="profile">
        <p>
          <span>角色:</span>
          <span title={actor.name}>{actor.name}</span>
        </p>
        <p>
          <span>说明:</span>
          <span title={actor.desc}>{actor.desc}</span>
        </p>
        <p className="action">{props.actions}</p>
      </div>
    </Container>
  );
});
ActorCard.displayName = 'ActorCard';

export const ActorCardListContainer = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: flex-start;
  align-content: flex-start;
  padding: 12px 0;

  .actor-card {
    margin-right: 8px;

    ${(props) => props.theme.mixins.mobile('margin-right: 0;')}
  }
`;
