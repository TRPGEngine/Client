import type { BuiltinHandlerName } from 'mediasoup-client/lib/types';

export interface DeviceType {
  flag: string;
  name: string;
  version: string;
}

export interface RoomClientOptions {
  roomId: string;
  peerId: string;
  displayName: string;
  device: DeviceType;
  handlerName?: BuiltinHandlerName;
  useSimulcast?: boolean;
  useSharingSimulcast?: boolean;
  forceTcp?: boolean;
  produce?: boolean;
  consume?: boolean;
  forceH264?: boolean;
  forceVP9?: boolean;
  svc?: string;
  datachannel?: boolean;
  externalVideo?: boolean;
}
