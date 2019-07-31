import { NativeModules } from 'react-native';

interface UMPush {
  addAlias: (
    alias: string,
    alias_type: string,
    callback: ((code: number) => void)
  ) => void;

  addAliasType: any;

  addExclusiveAlias: (
    alias: string,
    alias_type: string,
    callback: ((code: number) => void)
  ) => void;

  addTag: (tag: string, callback: (code: number, remain: any) => void) => void;

  appInfo: (callback: (data: any) => void) => void;

  deleteAlias: (
    alias: string,
    alias_type: string,
    callback: ((code: number) => void)
  ) => void;

  deleteTag: (
    tag: string,
    callback: (code: number, remain: any) => void
  ) => void;

  getConstants: any;

  listTag: (callback: (code: number, tagList: string[]) => void) => void;
}

export const umPush: UMPush = NativeModules.UMPushModule;
