import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Typography, Row, Col, Divider, Result } from 'antd';
import { Avatar } from '@web/components/Avatar';
import { UserName } from '@web/components/UserName';
import styled from 'styled-components';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import ImageUploader from '@web/components/ImageUploader';
import { requestUpdateGroupInfo } from '@redux/actions/group';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { useJoinedGroupInfo, useIsGroupManager } from '@redux/hooks/group';

const GroupInfoItemContainer = styled.div`
  margin-bottom: 16px;
`;

const GroupInfoItemTitle = styled.div`
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.color.channelsDefault};
  margin-bottom: 8px;
`;

const GroupInfoItemValue = styled.div`
  line-height: 40px;
  font-size: 16px;
  ${(props) => props.theme.mixins.oneline};
`;

const GroupInfoAvatarContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
`;

const GroupInfoItem: React.FC<{
  title: string;
  value: React.ReactNode;
  editable?: boolean;
  onSave?: (val: string) => void;
}> = TMemo((props) => {
  const valueTitle = _isString(props.value) ? props.value : undefined;

  return (
    <GroupInfoItemContainer>
      <GroupInfoItemTitle>{props.title}</GroupInfoItemTitle>
      <GroupInfoItemValue title={valueTitle}>{props.value}</GroupInfoItemValue>
    </GroupInfoItemContainer>
  );
});
GroupInfoItem.displayName = 'GroupInfoItem';

interface GroupInfoSummaryProps {
  groupUUID: string;
}
export const GroupInfoSummary: React.FC<GroupInfoSummaryProps> = TMemo(
  (props) => {
    const { groupUUID } = props;
    const dispatch = useTRPGDispatch();
    const groupInfo = useJoinedGroupInfo(groupUUID);

    const isGroupManager = useIsGroupManager(groupUUID);

    const handleUpdateAvatar = useCallback(
      (imageInfo: any) => {
        if (_isNil(groupInfo)) {
          return;
        }

        dispatch(
          requestUpdateGroupInfo(groupInfo.uuid, { avatar: imageInfo.url })
        );
      },
      [groupInfo?.uuid]
    );

    if (_isNil(groupInfo)) {
      return <Result status="warning" title="找不到相关信息" />;
    }

    return (
      <div>
        <Typography.Title level={3}>概况</Typography.Title>
        <Row>
          <Col sm={12}>
            <GroupInfoAvatarContainer>
              {isGroupManager ? (
                <div>
                  <ImageUploader
                    width="128"
                    height="128"
                    type="group"
                    circle={true}
                    attachUUID={groupInfo.uuid}
                    onUploadSuccess={handleUpdateAvatar}
                  >
                    <Avatar
                      src={groupInfo.avatar}
                      name={groupInfo.name}
                      size={128}
                    />
                  </ImageUploader>
                </div>
              ) : (
                <Avatar
                  src={groupInfo.avatar}
                  name={groupInfo.name}
                  size={128}
                />
              )}
            </GroupInfoAvatarContainer>
          </Col>
          <Col sm={12}>
            <GroupInfoItem title="团名称" value={groupInfo.name} />
            <GroupInfoItem title="团唯一标识" value={groupInfo.uuid} />
          </Col>
        </Row>

        <Divider />

        <Row>
          <Col flex={1}>
            <GroupInfoItem
              title="主持人"
              value={<UserName uuid={groupInfo.owner_uuid} />}
            />
          </Col>
          <Col flex={1}>
            <GroupInfoItem title="简介" value={groupInfo.desc} />
          </Col>
        </Row>

        <Divider />

        <Row>
          <Col flex={1}>
            <GroupInfoItem
              title="团管理数"
              value={`${groupInfo.managers_uuid?.length} 人`}
            />
          </Col>
          <Col flex={1}>
            <GroupInfoItem
              title="成员数"
              value={`${groupInfo.group_members?.length} 人`}
            />
          </Col>
          <Col flex={1}>
            <GroupInfoItem
              title="团人物卡数"
              value={`${groupInfo.group_actors?.length} 人`}
            />
          </Col>
          <Col flex={1}>
            <GroupInfoItem
              title="团地图数"
              value={`${groupInfo.maps_uuid?.length} 人`}
            />
          </Col>
        </Row>
      </div>
    );
  }
);
GroupInfoSummary.displayName = 'GroupInfoSummary';
