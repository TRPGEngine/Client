import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import {
  RecruitItemType,
  recruitPlatformMap,
  recruitContactTypeMap,
} from '@shared/model/trpg';
import { Divider, Tooltip, Tag } from 'antd';
import { ColorTag } from '@web/components/ColorTag';
import { getFromNow, getFullDate } from '@shared/utils/date-helper';
import HTML from '@web/components/HTML';
import styledTheme from '@shared/utils/theme';

type RecruitItemSize = 'default' | 'large';

const RecruitItemContainer = styled.div<{
  size?: RecruitItemSize;
}>`
  padding: 12px;
  height: ${(props) => (props.size === 'large' ? '80vh' : 'auto')};
  width: ${(props) => (props.size === 'large' ? '80vw' : '180px')};
  max-width: 420px;
  background-color: white;
  box-shadow: ${(props) => props.theme.boxShadow.normal};
  display: flex;
  flex-direction: column;

  main {
    flex: 1;
    overflow: auto;
  }

  .time {
    color: ${(props) => props.theme.color.gray};
    text-align: right;
  }
`;

interface RecruitItemProps {
  size?: RecruitItemSize;
  data: RecruitItemType;
}
export const RecruitItem: React.FC<RecruitItemProps> = TMemo((props) => {
  const data = props.data;
  const size = props.size;

  return (
    <RecruitItemContainer size={size}>
      <main>
        <h2>
          {data.title}
          {data.completed && <Tag>已满</Tag>}
        </h2>
        <HTML html={data.content} />
      </main>

      <Divider />

      <Tooltip
        title={
          <div>
            <span>
              <ColorTag text={recruitContactTypeMap[data.contact_type]} />
            </span>
            <span>
              {data.contact_content || (
                <span style={{ color: styledTheme.color.silver }}>
                  未填写联系方式
                </span>
              )}
            </span>
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
RecruitItem.defaultProps = {
  size: 'default',
};
