import React from 'react';
import reducers from './reducers';
import { TMemo } from '@shared/components/TMemo';
import {
  Provider as ReduxProvider,
  createSelectorHook,
  createDispatchHook,
  ReactReduxContextValue,
} from 'react-redux';
import type { AllRTCStateType } from './types';
import { RTC_DEBUG } from '@shared/utils/consts';
import _get from 'lodash/get';
import { configureStore } from '@reduxjs/toolkit';

// const store = createStore(reducers, undefined, enhancer);
const isDebug = _get(window, ['localStorage', RTC_DEBUG]) === 'true';
const store = configureStore({
  reducer: reducers,
  devTools: isDebug
    ? {
        name: 'RTC',
      }
    : false,
});
export type RTCStoreType = typeof store;
const RTCRoomReduxContext = React.createContext<ReactReduxContextValue>({
  store,
  storeState: undefined,
});
RTCRoomReduxContext.displayName = 'RTCRoomReduxContext';

export const RTCRoomReduxProvider: React.FC = TMemo((props) => {
  return (
    <ReduxProvider store={store} context={RTCRoomReduxContext}>
      {props.children}
    </ReduxProvider>
  );
});
RTCRoomReduxProvider.displayName = 'RTC(RTCRoomReduxProvider)';

export function getStore() {
  return store;
}

type UseRTCRoomStateSelector = <TSelected = unknown>(
  selector: (state: AllRTCStateType) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
) => TSelected;
export const useRTCRoomStateSelector: UseRTCRoomStateSelector = createSelectorHook(
  RTCRoomReduxContext
);
export const useRTCRoomStateDispatch = createDispatchHook(RTCRoomReduxContext);
