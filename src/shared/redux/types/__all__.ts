import { AnyAction, Action } from 'redux';
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

// 用于state声明
export type TRPGState = AllState;

// fork from redux-thunk declaration
interface ThunkDispatch<S, E, A extends Action> {
  <T extends A>(action: T): T;
  <R>(asyncAction: TRPGAction): R;
}

type ThunkAction<R, S, E, A extends Action> = (
  dispatch: ThunkDispatch<S, E, A>,
  getState: () => S,
  extraArgument: E
) => R;

export type TRPGDispatch = ThunkDispatch<any, any, AnyAction>;

// 用于组件声明
export interface TRPGDispatchProp {
  dispatch: TRPGDispatch;
}

// 用于action声明
export type TRPGAction =
  | ThunkAction<any, TRPGState, any, AnyAction>
  | AnyAction;
