import { createContext, useContext } from 'react';
import _isNil from 'lodash/isNil';

const defaultMessageItemConfig = {
  /**
   * 是否显示操作按钮
   */
  operation: true,
};

type MessageItemConfig = typeof defaultMessageItemConfig;

export const MessageItemConfigContext = createContext<MessageItemConfig>(
  defaultMessageItemConfig
);
MessageItemConfigContext.displayName = 'MessageItemConfigContext';

export function useMessageItemConfigContext() {
  const context = useContext(MessageItemConfigContext);
  if (_isNil(context)) {
    return defaultMessageItemConfig;
  } else {
    return context;
  }
}
