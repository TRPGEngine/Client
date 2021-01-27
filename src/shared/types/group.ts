import type { PlayerUser } from './player';

export interface GroupActorItem {
  uuid: string;
  actor_uuid: string;
  actor_info: {};
  actor_template_uuid: string;
  name: string;
  desc: string;
  avatar: string;
  passed: boolean;
  enabled: boolean;

  owner?: PlayerUser;
}
