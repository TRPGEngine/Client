import { DeviceType } from '@src/rtc/type';

export interface MeStateType {
  id: string;
  displayName: string;
  displayNameSet: boolean;
  device: DeviceType;
  canSendMic: boolean;
  canSendWebcam: boolean;
  canChangeWebcam: boolean;
  webcamInProgress: boolean;
  shareInProgress: boolean;
  audioOnly: boolean;
  audioOnlyInProgress: boolean;
  audioMuted: boolean;
  restartIceInProgress: boolean;
}
