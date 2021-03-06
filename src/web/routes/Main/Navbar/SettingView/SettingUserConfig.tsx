import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Select, Switch } from 'antd';
import { useTRPGDispatch, useTRPGSelector } from '@redux/hooks/useTRPGSelector';
import { FullModalField } from '@web/components/FullModalField';
import { t, useTranslation } from '@shared/i18n';
import { setUserSettings } from '@redux/actions/settings';
import type { MsgStyleType } from '@shared/types/chat';
import { MessageItem } from '@shared/components/message/MessageItem';
import styled from 'styled-components';
import { useCurrentUserUUID } from '@redux/hooks/user';
import { buildMsgPayload } from '@shared/utils/data-helper';

const MsgPreviewViewContainer = styled.div`
  max-width: 360px;
  border-radius: ${({ theme }) => theme.radius.card};
  border: ${({ theme }) => theme.border.standard};
  padding: 10px;
  margin-bottom: 16px;
`;

const MsgPreviewView: React.FC = TMemo(() => {
  const sender_uuid = useCurrentUserUUID();
  const msgStyleCombine = useTRPGSelector(
    (state) => state.settings.user.msgStyleCombine ?? false
  );

  return (
    <MsgPreviewViewContainer>
      <MessageItem
        data={buildMsgPayload({
          sender_uuid: 'trpgbot',
          message: t('欢迎使用'),
          data: {
            name: t('测试用户'),
          },
        })}
        emphasizeTime={true}
      />
      <MessageItem
        data={buildMsgPayload({
          sender_uuid: 'trpgbot',
          message: 'TRPG Engine',
          data: {
            name: t('测试用户'),
          },
        })}
        emphasizeTime={false}
        omitSenderInfo={msgStyleCombine}
      />
      <MessageItem
        data={buildMsgPayload({
          sender_uuid,
          message: t('专为跑团而生'),
        })}
        emphasizeTime={false}
      />
    </MsgPreviewViewContainer>
  );
});
MsgPreviewView.displayName = 'MsgPreviewView';

/**
 * 个人设置
 */
export const SettingUserConfig: React.FC = TMemo(() => {
  const userSettings = useTRPGSelector((state) => state.settings.user);
  const { t } = useTranslation();
  const dispatch = useTRPGDispatch();

  const handleSetMsgType = useCallback((value: MsgStyleType) => {
    dispatch(setUserSettings({ msgStyleType: value }));
  }, []);

  const handleSetMsgCombine = useCallback((checked: boolean) => {
    dispatch(setUserSettings({ msgStyleCombine: checked }));
  }, []);

  const handleSetMsgInputHistorySwitch = useCallback((checked: boolean) => {
    dispatch(setUserSettings({ msgInputHistorySwitch: checked }));
  }, []);

  return (
    <div>
      <FullModalField
        title={t('消息类型')}
        content={
          <Select value={userSettings.msgStyleType} onChange={handleSetMsgType}>
            <Select.Option value="bubble">{t('气泡模式')}</Select.Option>
            <Select.Option value="compact">{t('紧凑模式')}</Select.Option>
          </Select>
        }
      />
      <FullModalField
        title={t('合并消息')}
        content={
          <Switch
            checked={Boolean(userSettings.msgStyleCombine)}
            onChange={handleSetMsgCombine}
          />
        }
      />

      <MsgPreviewView />

      <FullModalField
        title={t('上下键切换历史消息')}
        content={
          <Switch
            checked={Boolean(userSettings.msgInputHistorySwitch)}
            onChange={handleSetMsgInputHistorySwitch}
          />
        }
      />
    </div>
  );
});
SettingUserConfig.displayName = 'SettingUserConfig';
