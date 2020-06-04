import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { RecruitItemType } from '@portal/model/trpg';
import { Divider, Tooltip } from 'antd';
import { ColorTag } from '@web/components/ColorTag';
import { getFromNow } from '@shared/utils/date-helper';

const RecruitItemContainer = styled.div`
  padding: 12px;
  width: 180px;
  background-color: white;
  box-shadow: ${(props) => props.theme.boxShadow.normal};

  .time {
    color: ${(props) => props.theme.color.gray};
    text-align: right;
  }
`;

interface RecruitItemProps {
  data: RecruitItemType;
}
export const RecruitItem: React.FC<RecruitItemProps> = TMemo((props) => {
  const data = props.data;

  return (
    <RecruitItemContainer>
      <h2>{data.title}</h2>
      <pre>{data.content}</pre>

      <Divider />

      <Tooltip
        title={
          <p>
            <span>
              <ColorTag text={data.contact_type} />
            </span>
            <span>{data.contact_content}</span>
          </p>
        }
      >
        <p>
          <span>
            <ColorTag text={data.platform} />
          </span>
          <span>{data.author}</span>
        </p>
      </Tooltip>

      <Tooltip title={data.updatedAt}>
        <p className="time">
          <span>{getFromNow(data.updatedAt)}</span>
        </p>
      </Tooltip>
    </RecruitItemContainer>
  );
});
RecruitItem.displayName = 'RecruitItem';
