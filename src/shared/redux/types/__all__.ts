import { Record } from 'immutable';
import { ActorState } from './actor';
import { CacheState } from './cache';
import { ChatState } from './chat';
import { GroupState } from './group';
import { NoteState } from './note';
import { SettingsState } from './settings';
import { UIState } from './ui';
import { UserState } from './user';

interface AllState {
  actor: ActorState;
  cache: CacheState;
  chat: ChatState;
  group: GroupState;
  note: NoteState;
  settings: SettingsState;
  ui: UIState;
  user: UserState;
  [other: string]: any;
}

export type TRPGState = Record<AllState>;
