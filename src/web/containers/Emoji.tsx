import React from 'react';
import { emojify, getCodeList } from '../../shared/utils/emojione';

const Emoji = React.memo(() => {
  return (
    <div>
      {getCodeList().people.map((item) => (
        <span key={item}>{emojify(item)}</span>
      ))}
      {getCodeList().nature.map((item) => (
        <span key={item}>{emojify(item)}</span>
      ))}
      {getCodeList().objects.map((item) => (
        <span key={item}>{emojify(item)}</span>
      ))}
      {getCodeList().places.map((item) => (
        <span key={item}>{emojify(item)}</span>
      ))}
      {getCodeList().symbols.map((item) => (
        <span key={item}>{emojify(item)}</span>
      ))}
    </div>
  );
});

export default Emoji;
