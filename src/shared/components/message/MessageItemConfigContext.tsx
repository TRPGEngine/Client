import React, { createContext, useContext, useMemo } from 'react';
import _isNil from 'lodash/isNil';
import { TMemo } from '../TMemo';

const defaultMessageItemConfig = {
  /**
   * 是否显示操作按钮
   */
  operation: true,

  /**
   * 是否点击头像后会出现popover
   */
  popover: true,
};

type MessageItemConfig = typeof defaultMessageItemConfig;

/**
 * 该上下文不应该直接暴露
 * 只能通过封装的方法来处理
 */
const MessageItemConfigContext = createContext<MessageItemConfig>(
  defaultMessageItemConfig
);
MessageItemConfigContext.displayName = 'MessageItemConfigContext';

/**
 * 封装的消息提供器
 * 可以只配置一部分内容，缺少的内容会由默认值替代
 */
export const MessageItemConfigContextProvider: React.FC<{
  config: Partial<MessageItemConfig>;
}> = TMemo((props) => {
  const config = useMemo(() => {
    return {
      ...defaultMessageItemConfig,
      ...props.config,
    };
  }, [props.config]);

  return (
    <MessageItemConfigContext.Provider value={config}>
      {props.children}
    </MessageItemConfigContext.Provider>
  );
});
MessageItemConfigContextProvider.displayName =
  'MessageItemConfigContextProvider';

export function useMessageItemConfigContext() {
  const context = useContext(MessageItemConfigContext);
  if (_isNil(context)) {
    return defaultMessageItemConfig;
  } else {
    return context;
  }
}
