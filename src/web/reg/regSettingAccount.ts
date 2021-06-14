import type React from 'react';
import { buildRegList } from '@shared/manager/buildRegList';
import type { UserInfo } from '@redux/types/user';

type AccountAttributeBuilder = (context: {
  userInfo: Partial<UserInfo>;
  buildUpdateFieldFn: (field: string) => (val: string) => void;
}) => React.ReactNode;

export const [extraSettingAccountAttribute, regSettingAccountAttribute] =
  buildRegList<AccountAttributeBuilder>();
