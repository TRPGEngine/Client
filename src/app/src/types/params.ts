import { ConverseType } from '@redux/types/chat';
import WebView from 'react-native-webview';
import { WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';

export type ChatType = ConverseType;
export interface ChatParams {
  uuid: string;
  type: ChatType;
  name: string;
  isWriting?: boolean;
}

export type GroupDataParams = Pick<ChatParams, 'uuid' | 'type' | 'name'>;

export type GroupMemberParams = Pick<ChatParams, 'uuid'>;

type WebviewAfterLoadCallback = (
  webview: WebView,
  e: WebViewNavigationEvent
) => void;
export type WebViewParams = {
  url: string;
  title?: string;
  injectedJavaScript?: string;
  afterLoad?: WebviewAfterLoadCallback;
};

export type TRPGTabParamList = {
  TRPG: undefined;
  Contacts: undefined;
  Account: undefined;
};

export type TRPGStackParamList = {
  LaunchScreen: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Settings: undefined;
  SettingsDeviceInfo: undefined;
  SettingsDevelopLab: undefined;
  About: undefined;
  Chat: ChatParams & { headerRightFunc?: () => void };
  AddFriend: undefined;
  Profile: {
    uuid: string;
    name: string;
    type: 'user' | 'group';
  };
  GroupProfile: { uuid: string; name: string };
  ProfileModify: undefined;
  CreateGroup: undefined;
  GroupData: GroupDataParams;
  GroupRule: undefined;
  GroupMember: GroupMemberParams;
  UserSelect: {
    uuids: string[];
    onSelected: (selectedUUID: string[]) => void;
    title?: string;
    selectedUUIDs?: string[];
  };
  Version: undefined;
  Debug: undefined;
  Document: undefined;
  Webview: WebViewParams;
};
