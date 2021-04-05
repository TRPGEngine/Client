import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PlayerUser } from '@shared/model/player';

interface UserState {
  jwt: string | null;
  userInfo: PlayerUser | null;
}

const initialState = { jwt: null, userInfo: null } as UserState;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo(
      state,
      action: PayloadAction<{
        jwt: string;
        userInfo: PlayerUser;
      }>
    ) {
      state.jwt = action.payload.jwt;
      state.userInfo = action.payload.userInfo;
    },
  },
});

export const { setUserInfo } = userSlice.actions;
export const userReducer = userSlice.reducer;
