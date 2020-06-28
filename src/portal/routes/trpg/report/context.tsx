import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import {
  MessageItemConfigContextProvider,
  MessageItemConfigPartial,
} from '@shared/components/message/MessageItemConfigContext';

export const ReportContextProvider: React.FC = TMemo((props) => {
  const config = useMemo<MessageItemConfigPartial>(
    () => ({ showMsgReply: false, operation: false }),
    []
  );
  return (
    <MessageItemConfigContextProvider config={config}>
      {props.children}
    </MessageItemConfigContextProvider>
  );
});
ReportContextProvider.displayName = 'ReportContextProvider';
