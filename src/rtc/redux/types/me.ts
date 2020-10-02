import { DeviceType } from '@src/rtc/type';

export interface MeStateType {
  id: string | null;
  displayName: string | null | undefined;
  displayNameSet: boolean;
  device: DeviceType | null;
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
