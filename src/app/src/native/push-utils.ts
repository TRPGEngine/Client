import { NativeModules } from 'react-native';

export enum Code {
  SUCCESS = 200,
  ERROR = 0,
}

interface UMPush {
  addAlias: (
    alias: string,
    alias_type: string,
    callback: (code: Code) => void
  ) => void;

  addAliasType: any;

  addExclusiveAlias: (
    alias: string,
    alias_type: string,
    callback: (code: Code) => void
  ) => void;

  addTag: (tag: string, callback: (code: Code, remain: any) => void) => void;

  // 注册push服务
  register: (callback: (code: Code, ret: string) => void) => void;

  appInfo: (callback: (result: string) => void) => void;

  // 获取registrationId
  getRegistrationId: (callback: (registrationId: string) => void) => void;

  deleteAlias: (
    alias: string,
    alias_type: string,
    callback: (code: Code) => void
  ) => void;

  deleteTag: (tag: string, callback: (code: Code, remain: any) => void) => void;

  getConstants: any;

  listTag: (callback: (code: Code, tagList: string[]) => void) => void;
}

export const umPush: UMPush = NativeModules.UMPushModule;
