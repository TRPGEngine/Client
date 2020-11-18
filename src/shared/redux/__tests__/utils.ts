import configureStore from '@shared/redux/configureStore';
import { TRPGState, TRPGMiddleware, TRPGStore } from '@redux/types/__all__';
import { testUserInfo } from './example/user';
import { Provider } from 'react-redux';
import React from 'react';

export function buildBlankTestState(): TRPGState {
  return configureStore().getState();
}

const blankState = buildBlankTestState();
const testState: TRPGState = {
  ...blankState,
  user: {
    ...blankState.user,
    info: testUserInfo,
  },
};

/**
 * 构建测试用的store
 */
export function buildTestStore(overwriteState: Partial<TRPGState> = {}) {
  const initialState: TRPGState = {
    ...testState,
    ...overwriteState,
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

interface BuildTestReduxProviderOptions {
  overwriteState?: Partial<TRPGState>;
}
export function buildTestReduxProvider(
  options?: BuildTestReduxProviderOptions
): {
  Provider: React.FC;
  store: TRPGStore;
} {
  const { store } = buildTestStore(options?.overwriteState);

  return {
    Provider: (props) => {
      return React.createElement(Provider, { store }, props.children);
    },
    store,
  };
}
