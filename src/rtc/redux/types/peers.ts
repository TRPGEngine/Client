import { DeviceType } from '@src/rtc/type';

export interface BasePeerType {
  id: string;
  displayName: string;
  device: DeviceType;
}

interface PeerType extends BasePeerType {
  consumers: string[];
  dataConsumers: string[];
}

export interface PeersStateType {
  [peerId: string]: PeerType;
}
