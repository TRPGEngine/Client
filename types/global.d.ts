import { Middleware, Dispatch, Action, AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

declare module 'redux' {
  export interface Dispatch<A extends Action = AnyAction, S = {}> {
    <R, E>(thunk: ThunkAction<R, S, E, A>): R;
  }
}
