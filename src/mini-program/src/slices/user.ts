import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getStorage } from '@shared/manager/storage';
import type { PlayerUser } from '@shared/model/player';
import { TARO_JWT_KEY } from '@shared/utils/consts';
import _get from 'lodash/get';

interface UserState {
  jwt: string | null;
  info: PlayerUser | null;
}

const initialState = { jwt: null, info: null } as UserState;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo(
      state,
      action: PayloadAction<{
        jwt: string;
        info: PlayerUser;
      }>
    ) {
      const { jwt, info } = action.payload;
      state.jwt = jwt;
      state.info = info;

      if (typeof jwt === 'string') {
        // 存储jwt
        getStorage().save(TARO_JWT_KEY, jwt);
      }
    },
  },
});

export const { setUserInfo } = userSlice.actions;
export const userReducer = userSlice.reducer;
