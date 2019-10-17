import { AnyAction, Action } from 'redux';

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
export interface TRPGDispatchProp<A extends Action = AnyAction> {
  dispatch: ThunkDispatch<any, any, A>;
}

// 用于action声明
export type TRPGAction = ThunkAction<any, any, any, AnyAction> | AnyAction;
