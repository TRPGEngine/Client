import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Row, Col, Select, Space, Divider, Button } from 'antd';
import { Avatar } from '@web/components/Avatar';
import { useCurrentUserInfo } from '@redux/hooks/user';
import { getUserName } from '@shared/utils/data-helper';
import {
  FullModalField,
  DefaultFullModalInputEditorRender,
  DefaultFullModalTextAreaEditorRender,
  FullModalFieldEditorRenderComponent,
} from '@web/components/FullModalField';
import { getFullDate } from '@shared/utils/date-helper';
import ImageUploader from '@web/components/ImageUploader';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { updateInfo } from '@redux/actions/user';
import { AlignmentChoose } from '@web/components/AlignmentChoose';
import { useTranslation } from '@shared/i18n';
import { TipIcon } from '@web/components/TipIcon';
import { getDocsUrl } from '@shared/utils/string-helper';
import { openModal } from '@web/components/Modal';
import { ChangePassword } from '@web/components/modals/ChangePassword';

const GenderSelector: FullModalFieldEditorRenderComponent = TMemo(
  ({ value, onChange }) => {
    const { t } = useTranslation();

    return (
      <Select style={{ width: 200 }} value={value} onChange={onChange}>
        <Select.Option value="男">{t('男')}</Select.Option>
        <Select.Option value="女">{t('女')}</Select.Option>
        <Select.Option value="其他">{t('其他')}</Select.Option>
        <Select.Option value="保密">{t('保密')}</Select.Option>
      </Select>
    );
  }
);
GenderSelector.displayName = 'GenderSelector';

export const SettingAccountView: React.FC = TMemo(() => {
  const userInfo = useCurrentUserInfo();
  const userName = getUserName(userInfo);
  const dispatch = useTRPGDispatch();
  const { t } = useTranslation();

  const handleUpdateAvatar = (imageInfo: any) => {
    dispatch(updateInfo({ avatar: imageInfo.url }));
  };

  const buildUpdateFieldFn = (field: string) => {
    return (val: string) => {
      dispatch(updateInfo({ [field]: val }));
    };
  };

  const handleChangePassword = useCallback(() => {
    openModal(<ChangePassword />);
  }, []);

  return (
    <div>
      <Row>
        <Col sm={6}>
          <ImageUploader
            width="128"
            height="128"
            type="user"
            attachUUID={userInfo.uuid}
            onUploadSuccess={handleUpdateAvatar}
            circle={true}
          >
            <Avatar src={userInfo.avatar} name={userName} size={128} />
          </ImageUploader>
        </Col>
        <Col sm={18}>
          <FullModalField
            title={
              <Space size={4}>
                {t('用户名')}
                <TipIcon desc={t('唯一标识, 用于登录')} />
              </Space>
            }
            value={userInfo.username}
          />
          <FullModalField
            title={t('昵称')}
            value={userInfo.nickname}
            editable={true}
            renderEditor={DefaultFullModalInputEditorRender}
            onSave={buildUpdateFieldFn('nickname')}
          />
          <FullModalField
            title={t('性别')}
            value={userInfo.sex}
            editable={true}
            renderEditor={GenderSelector}
            onSave={buildUpdateFieldFn('sex')}
          />
          <FullModalField
            title={
              <Space size={4}>
                {t('阵营')}
                <TipIcon
                  desc={t('你觉得你是一个怎么样的人？')}
                  link={getDocsUrl('/docs/roleplay/alignment')}
                />
              </Space>
            }
            value={userInfo.alignment}
            content={t(userInfo.alignment ?? '未选择')}
            editable={true}
            renderEditor={AlignmentChoose as any}
            onSave={buildUpdateFieldFn('alignment')}
          />
          <FullModalField
            title={
              <Space size={4}>
                {t('QQ号')}
                <TipIcon desc={t('方便开发者联系到你')} />
              </Space>
            }
            value={userInfo.qq_number}
            editable={true}
            renderEditor={DefaultFullModalInputEditorRender}
            onSave={buildUpdateFieldFn('qq_number')}
          />
          <FullModalField
            title={t('简介')}
            value={userInfo.sign}
            content={<pre>{userInfo.sign}</pre>}
            editable={true}
            renderEditor={DefaultFullModalTextAreaEditorRender}
            onSave={buildUpdateFieldFn('sign')}
          />
          <FullModalField
            title={t('最后登录')}
            value={`${getFullDate(userInfo.last_login)}`}
          />
        </Col>
      </Row>

      <Divider />

      <Row>
        <Button danger={true} onClick={handleChangePassword}>
          {t('修改密码')}
        </Button>
      </Row>
    </div>
  );
});
SettingAccountView.displayName = 'SettingAccountView';
