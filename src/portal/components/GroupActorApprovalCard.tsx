import React from 'react';
import Avatar from '@web/components/Avatar';
import { Card } from 'antd';
import styled from 'styled-components';
import _isString from 'lodash/isString';
import _invoke from 'lodash/invoke';

const Meta = Card.Meta;

const ApprovalCardContainer = styled(Card)`
  margin-bottom: 10px !important;
`;

export interface ApprovalCardProps {
  uuid: string;
  name: string;
  desc: string;
  avatar: string;

  onAgree?: (uuid: string) => void;
  onRefuse?: (uuid: string) => void;
}
const GroupActorApprovalCard = React.memo((props: ApprovalCardProps) => {
  return (
    <ApprovalCardContainer
      actions={[
        <div onClick={() => _invoke(props, 'onAgree', props.uuid)}>
          <i className="iconfont">&#xe66b;</i>通过
        </div>,
        <div onClick={() => _invoke(props, 'onRefuse', props.uuid)}>
          <i className="iconfont">&#xe680;</i>拒绝
        </div>,
      ]}
    >
      <Meta
        avatar={<Avatar name={props.name} src={props.avatar} />}
        title={props.name}
        description={props.desc}
      />
    </ApprovalCardContainer>
  );
});

export default GroupActorApprovalCard;
