import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { FullModalField } from '@web/components/FullModalField';
import { Button, Switch } from 'antd';
import { useTranslation } from '@shared/i18n';
import { useGroupDetail } from '@redux/hooks/group';
import { useAsyncFn, useMap } from 'react-use';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import type { GroupDetail } from '@redux/types/group';
import { updateGroupDetail } from '@shared/model/group';
import { showToasts } from '@shared/manager/ui';

interface GroupDetailSettings {
  groupUUID: string;
}
export const GroupDetailSettings: React.FC<GroupDetailSettings> = TMemo(
  (props) => {
    const { groupUUID } = props;
    const { t } = useTranslation();
    const groupDetail = useGroupDetail(groupUUID);
    const [editMap, { set: setEditData, reset: resetEditData }] = useMap<
      Partial<GroupDetail>
    >({});

    const getData = (key: keyof GroupDetail, defaultValue: any) => {
      return editMap[key] ?? _get(groupDetail, key, defaultValue);
    };

    const [{ loading }, handleSaveDetail] = useAsyncFn(async () => {
      try {
        await updateGroupDetail(groupUUID, editMap);
        showToasts(t('更新成功', 'success'));
      } catch (err) {
        showToasts(t('失败') + err, 'error');
      }
    }, [groupUUID, editMap, resetEditData]);

    return (
      <div>
        <FullModalField
          title={t('禁止普通成员查看所有角色')}
          content={
            <Switch
              checked={getData('disable_check_actor', false)}
              onChange={(checked) =>
                setEditData('disable_check_actor', checked)
              }
            />
          }
        />

        <FullModalField
          title={t('禁止普通成员查看会话中角色')}
          content={
            <Switch
              checked={getData('disable_check_actor_in_chat', false)}
              onChange={(checked) =>
                setEditData('disable_check_actor_in_chat', checked)
              }
            />
          }
        />

        <FullModalField
          title={t('更新角色卡时不发送系统提示')}
          content={
            <Switch
              checked={getData('disable_system_notify_on_actor_updated', false)}
              onChange={(checked) =>
                setEditData('disable_system_notify_on_actor_updated', checked)
              }
            />
          }
        />

        {!_isEmpty(editMap) && (
          <Button type="primary" loading={loading} onClick={handleSaveDetail}>
            {t('保存')}
          </Button>
        )}
      </div>
    );
  }
);
GroupDetailSettings.displayName = 'GroupDetailSettings';
