import React from 'react';
import { GroupInfo } from '@redux/types/group';

/**
 * 记录当前所在团的信息上下文
 */

export const GroupInfoContext = React.createContext<GroupInfo>(null);
