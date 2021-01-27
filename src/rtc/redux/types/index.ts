import type { ConsumersStateType } from './consumers';
import type { DataConsumersStateType } from './dataConsumers';
import type { DataProducersStateType } from './dataProducers';
import type { MeStateType } from './me';
import type { NotificationsStateType } from './notifications';
import type { PeersStateType } from './peers';
import type { ProducersStateType } from './producers';
import type { RoomStateType } from './room';

export interface AllRTCStateType {
  room: RoomStateType;
  me: MeStateType;
  producers: ProducersStateType;
  dataProducers: DataProducersStateType;
  peers: PeersStateType;
  consumers: ConsumersStateType;
  dataConsumers: DataConsumersStateType;
  notifications: NotificationsStateType;
}
