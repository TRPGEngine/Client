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
import { useTRPGDispatch } from '@redux/hooks/useTRPGSelector';
import { useJoinedGroupInfo, useIsGroupManager } from '@redux/hooks/group';
import {
  DefaultFullModalInputEditorRender,
  DefaultFullModalTextAreaEditorRender,
  FullModalField,
} from '@web/components/FullModalField';
import { t } from '@shared/i18n';

const GroupInfoAvatarContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
`;

function useGroupAction(groupUUID: string | undefined) {
  const dispatch = useTRPGDispatch();

  const handleUpdateAvatar = useCallback(
    (imageInfo: any) => {
      if (_isNil(groupUUID)) {
        return;
      }

      dispatch(requestUpdateGroupInfo(groupUUID, { avatar: imageInfo.url }));
    },
    [groupUUID]
  );

  const handleUpdateGroupName = useCallback(
    (val: string) => {
      if (_isNil(groupUUID)) {
        return;
      }

      dispatch(requestUpdateGroupInfo(groupUUID, { name: val }));
    },
    [groupUUID]
  );

  const handleUpdateGroupDesc = useCallback(
    (val: string) => {
      if (_isNil(groupUUID)) {
        return;
      }

      dispatch(requestUpdateGroupInfo(groupUUID, { desc: val }));
    },
    [groupUUID]
  );

  return { handleUpdateAvatar, handleUpdateGroupName, handleUpdateGroupDesc };
}

interface GroupInfoSummaryProps {
  groupUUID: string;
}
export const GroupInfoSummary: React.FC<GroupInfoSummaryProps> = TMemo(
  (props) => {
    const { groupUUID } = props;
    const groupInfo = useJoinedGroupInfo(groupUUID);
    const { handleUpdateAvatar, handleUpdateGroupName, handleUpdateGroupDesc } =
      useGroupAction(groupInfo?.uuid);

    const isGroupManager = useIsGroupManager(groupUUID);

    if (_isNil(groupInfo)) {
      return <Result status="warning" title={t('找不到相关信息')} />;
    }

    return (
      <div>
        <Typography.Title level={3}>{t('概况')}</Typography.Title>
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
            <FullModalField
              title={t('团名称')}
              value={groupInfo.name}
              editable={isGroupManager}
              renderEditor={DefaultFullModalInputEditorRender}
              onSave={handleUpdateGroupName}
            />
            <FullModalField title={t('团唯一标识')} value={groupInfo.uuid} />
          </Col>
        </Row>

        <Divider />

        <Row>
          <Col flex={1}>
            <FullModalField
              title={t('主持人')}
              content={<UserName uuid={groupInfo.owner_uuid} />}
            />
          </Col>
          <Col flex={1}>
            <FullModalField
              title={t('简介')}
              value={groupInfo.desc}
              content={<pre>{groupInfo.desc}</pre>}
              editable={isGroupManager}
              renderEditor={DefaultFullModalTextAreaEditorRender}
              onSave={handleUpdateGroupDesc}
            />
          </Col>
        </Row>

        <Divider />

        <Row>
          <Col flex={1}>
            <FullModalField
              title={t('团管理数')}
              value={`${groupInfo.managers_uuid?.length} 人`}
            />
          </Col>
          <Col flex={1}>
            <FullModalField
              title={t('成员数')}
              value={`${groupInfo.group_members?.length} 人`}
            />
          </Col>
          <Col flex={1}>
            <FullModalField
              title={t('团人物卡数')}
              value={`${groupInfo.group_actors?.length} 人`}
            />
          </Col>
          {/* <Col flex={1}>
            <FullModalField
              title={t("团地图数")}
              value={`${groupInfo.maps_uuid?.length} 人`}
            />
          </Col> */}
        </Row>
      </div>
    );
  }
);
GroupInfoSummary.displayName = 'GroupInfoSummary';
