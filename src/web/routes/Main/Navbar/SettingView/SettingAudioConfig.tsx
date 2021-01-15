import { setSystemSettings } from '@redux/actions/settings';
import { useSystemSetting } from '@redux/hooks/settings';
import { TMemo } from '@shared/components/TMemo';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { useTranslation } from '@shared/i18n';
import { DefaultSettings } from '@shared/project.config';
import { FullModalField } from '@web/components/FullModalField';
import { Alert, Space, Switch } from 'antd';
import React, { useCallback, useState } from 'react';

/**
 * 语音设置
 */
export const SettingAudioConfig: React.FC = TMemo((props) => {
  const audioConstraints = useSystemSetting(
    'audioConstraints'
  ) as DefaultSettings['system']['audioConstraints'];
  const dispatch = useTRPGDispatch();
  const [isChanged, setIsChanged] = useState(false);
  const { t } = useTranslation();

  const handleSetAudioConstraints = useCallback(
    (newAudioConfig: Partial<MediaTrackConstraints>) => {
      dispatch(
        setSystemSettings({
          audioConstraints: {
            ...audioConstraints,
            ...newAudioConfig,
          },
        })
      );
      setIsChanged(true);
    },
    [audioConstraints]
  );

  return (
    <div>
      <Space direction="vertical">
        <FullModalField
          title={t('噪音抑制')}
          content={
            <Space>
              <Switch
                checked={audioConstraints.noiseSuppression}
                onChange={(checked) =>
                  handleSetAudioConstraints({
                    noiseSuppression: checked,
                  })
                }
              />
            </Space>
          }
        />

        <FullModalField
          title={t('自动增益')}
          content={
            <Space>
              <Switch
                checked={audioConstraints.autoGainControl}
                onChange={(checked) =>
                  handleSetAudioConstraints({
                    autoGainControl: checked,
                  })
                }
              />
            </Space>
          }
        />

        <FullModalField
          title={t('回音消除')}
          content={
            <Space>
              <Switch
                checked={audioConstraints.echoCancellation}
                onChange={(checked) =>
                  handleSetAudioConstraints({
                    echoCancellation: checked,
                  })
                }
              />
            </Space>
          }
        />

        {isChanged && (
          <Alert
            style={{ marginBottom: 10 }}
            message={t('语音设置变更在通话中无法生效')}
            type="warning"
          />
        )}
      </Space>
    </div>
  );
});
SettingAudioConfig.displayName = 'SettingAudioConfig';
