import type { AnyAction, Action, Store, Middleware, Reducer } from 'redux';
import type { ActorState } from './actor';
import type { CacheState } from './cache';
import type { ChatState } from './chat';
import type { GroupState } from './group';
import type { NoteState } from './note';
import type { SettingsState } from './settings';
import type { UIState } from './ui';
import type { UserState } from './user';
import {
  createAsyncThunk,
  AsyncThunkPayloadCreator,
  AsyncThunk,
} from '@reduxjs/toolkit';

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

export type TRPGStore = Store<TRPGState, any>;

export type TRPGReducer = Reducer<TRPGState, any>;

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

export type TRPGMiddleware = Middleware<{}, TRPGState, TRPGDispatch>;

interface TRPGThunkApiConfig {
  state: TRPGState;
  dispatch: TRPGDispatch;
  extra?: unknown;
  rejectValue?: unknown;
}

export function createTRPGAsyncThunk<ThunkArg, Returned = void>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<
    Returned,
    ThunkArg,
    TRPGThunkApiConfig
  >,
  options?: any
): AsyncThunk<Returned, ThunkArg, TRPGThunkApiConfig> {
  return createAsyncThunk(typePrefix, payloadCreator, options);
}
