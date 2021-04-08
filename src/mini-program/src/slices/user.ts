import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PlayerUser } from '@shared/model/player';

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
    },
  },
});

export const { setUserInfo } = userSlice.actions;
export const userReducer = userSlice.reducer;
