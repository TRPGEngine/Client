import React, { useCallback } from 'react';
import Avatar from '@web/components/Avatar';
import { Card } from 'antd';
import styled from 'styled-components';
import _isString from 'lodash/isString';
import _invoke from 'lodash/invoke';
import _isEmpty from 'lodash/isEmpty';
import { nav } from '@portal/history';
import { fetchGroupActorDetail } from '@shared/model/group';
import { Iconfont } from '@web/components/Iconfont';
import { t } from '@shared/i18n';

const Meta = Card.Meta;

const ApprovalCardContainer = styled(Card)`
  margin-bottom: 10px !important;
`;

const ApprovalCardTitle = styled.div`
  display: flex;
  align-items: flex-end;

  > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export interface ApprovalCardProps {
  uuid: string;
  name: string;
  desc: string;
  avatar: string;
  ownerName?: string;

  onAgree?: (uuid: string) => void;
  onRefuse?: (uuid: string) => void;
}
const GroupActorApprovalCard: React.FC<ApprovalCardProps> = React.memo(
  (props) => {
    const handleViewActor = useCallback(() => {
      fetchGroupActorDetail(props.uuid).then((actor) => {
        nav(`/actor/detail/${actor.actor_uuid}`);
      });
    }, [props.uuid]);

    return (
      <ApprovalCardContainer
        actions={[
          <div key="view" onClick={handleViewActor}>
            <Iconfont>&#xe613;</Iconfont> {t('查看')}
          </div>,
          <div key="pass" onClick={() => _invoke(props, 'onAgree', props.uuid)}>
            <Iconfont>&#xe66b;</Iconfont> {t('通过')}
          </div>,
          <div
            key="reject"
            onClick={() => _invoke(props, 'onRefuse', props.uuid)}
          >
            <Iconfont>&#xe680;</Iconfont> {t('拒绝')}
          </div>,
        ]}
      >
        <Meta
          avatar={<Avatar name={props.name} src={props.avatar} />}
          title={
            <ApprovalCardTitle>
              <span>{props.name}</span>{' '}
              {!_isEmpty(props.ownerName) ? (
                <small>({props.ownerName})</small>
              ) : null}
            </ApprovalCardTitle>
          }
          description={props.desc}
        />
      </ApprovalCardContainer>
    );
  }
);
GroupActorApprovalCard.displayName = 'GroupActorApprovalCard';

export default GroupActorApprovalCard;
