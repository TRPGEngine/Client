import type { UserAccount, UserProfile } from '../model/netease-music';
import React from 'react';

export const NeteaseUserinfoContext = React.createContext<{
  account: UserAccount | null;
  profile: UserProfile | null;
  isLogin: boolean;
}>({
  account: null,
  profile: null,
  isLogin: false,
});
NeteaseUserinfoContext.displayName = 'NeteaseUserinfoContext';
