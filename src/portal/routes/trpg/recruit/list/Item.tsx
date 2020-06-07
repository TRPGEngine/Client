import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import {
  RecruitItemType,
  recruitPlatformMap,
  recruitContactTypeMap,
} from '@portal/model/trpg';
import { Divider, Tooltip } from 'antd';
import { ColorTag } from '@web/components/ColorTag';
import { getFromNow, getFullDate } from '@shared/utils/date-helper';
import HTML from '@web/components/HTML';

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
      <HTML html={data.content} />

      <Divider />

      <Tooltip
        title={
          <div>
            <span>
              <ColorTag text={recruitContactTypeMap[data.contact_type]} />
            </span>
            <span>{data.contact_content}</span>
          </div>
        }
      >
        <p>
          <span>
            <ColorTag text={recruitPlatformMap[data.platform]} />
          </span>
          <span>{data.author}</span>
        </p>
      </Tooltip>

      <Tooltip title={getFullDate(data.updatedAt)}>
        <p className="time">
          <span>{getFromNow(data.updatedAt)}</span>
        </p>
      </Tooltip>
    </RecruitItemContainer>
  );
});
RecruitItem.displayName = 'RecruitItem';
