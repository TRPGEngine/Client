import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Select } from 'antd';
import { UserName } from './UserName';
import _isFunction from 'lodash/isFunction';
import { useTranslation } from '@shared/i18n';

/**
 * TODO: 实现输入搜索 与 最大长度限制
 * 输入搜索可以 参考 src/web/components/modal/UserSelector.tsx 的实现
 * 实现完可以将UserSelector的用户选择改为该组件实现
 */

interface UserUUIDSelectorProps {
  allUserUUIDs: string[];
  value: string[];
  onChange: (newValue: string[]) => void;
}
export const UserUUIDSelector: React.FC<UserUUIDSelectorProps> = TMemo(
  (props) => {
    const { allUserUUIDs, value, onChange } = props;
    const { t } = useTranslation();

    const handleChange = useCallback(
      (val: string[]) => {
        _isFunction(onChange) && onChange(val);
      },
      [onChange]
    );

    return (
      <Select<string[]>
        mode="multiple"
        value={value}
        placeholder={t('选择用户')}
        onChange={handleChange}
        style={{ width: '100%' }}
      >
        {allUserUUIDs.map((uuid) => {
          return (
            <Select.Option key={uuid} value={uuid}>
              <UserName uuid={uuid} />
            </Select.Option>
          );
        })}
      </Select>
    );
  }
);
UserUUIDSelector.displayName = 'UserUUIDSelector';
