import { BasePeerType } from './peers';

export interface MeStateType extends BasePeerType {
  displayNameSet: boolean;
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
