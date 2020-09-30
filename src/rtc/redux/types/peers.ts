import { DeviceType } from '@src/rtc/type';

export interface PeersStateType {
  [peerId: string]: {
    id: string;
    displayName: string;
    device: DeviceType;
    consumers: string[];
    dataConsumers: string[];
  };
}
