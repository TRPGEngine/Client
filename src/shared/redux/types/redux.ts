import { AnyAction, Action } from 'redux';
import { Record } from 'immutable';

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

// 用于组件声明
export interface TRPGDispatchProp {
  dispatch: ThunkDispatch<any, any, AnyAction>;
}

// 用于action声明
export type TRPGAction = ThunkAction<any, any, any, AnyAction> | AnyAction;

// 用于state声明
export type TRPGState = Record<any>;
