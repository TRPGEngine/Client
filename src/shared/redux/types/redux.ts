import { AnyAction, Action } from 'redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

// 用于组件声明
export interface TRPGDispatchProp<A extends Action = AnyAction> {
  dispatch: ThunkDispatch<any, any, A>;
}
