import React from 'react';
import { TMemo } from '@shared/components/TMemo';

const NotFound: React.FC = TMemo(() => {
  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>页面没找到</h2>
    </div>
  );
});
NotFound.displayName = 'NotFound';

export default NotFound;
