import configureStore from '@shared/redux/configureStore';
import { TRPGStore, TRPGState, TRPGMiddleware } from '@redux/types/__all__';
import { testUserInfo } from './example/user';

function buildBlankState(): TRPGState {
  return configureStore().getState();
}

/**
 * 构建测试用的store
 */
export function buildTestStore() {
  const blankState = buildBlankState();

  const initialState = {
    ...blankState,
    user: {
      ...blankState.user,
      info: testUserInfo,
    },
  };

  const actionTrigger = jest.fn(); // 用于检查redux的action被调用的情况
  const mockReduxMiddleware: TRPGMiddleware = ({ dispatch, getState }) => (
    next
  ) => (action) => {
    const type = action.type;

    actionTrigger(type, action);

    next(action);
  };

  const store = configureStore({
    initialState,
    additionMiddleware: [mockReduxMiddleware],
  });

  return { store, actionTrigger };
}
