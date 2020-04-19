import React, { useMemo, Fragment } from 'react';
import { parseMultilineText } from '../tags/utils';

export function useMultilineText(text: React.ReactNode): React.ReactElement {
  return useMemo(() => {
    if (typeof text !== 'string') {
      return <Fragment>{text}</Fragment>;
    }

    /**
     * 如果为字符串 则处理换行符
     */
    return (
      <Fragment>
        {parseMultilineText(text)
          .split('\n')
          .map((item, index) => (
            <div key={index}>{item}</div>
          ))}
      </Fragment>
    );
  }, [text]);
}
