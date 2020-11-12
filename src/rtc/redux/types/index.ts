import { ConsumersStateType } from './consumers';
import { DataConsumersStateType } from './dataConsumers';
import { DataProducersStateType } from './dataProducers';
import { MeStateType } from './me';
import { NotificationsStateType } from './notifications';
import { PeersStateType } from './peers';
import { ProducersStateType } from './producers';
import { RoomStateType } from './room';

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
