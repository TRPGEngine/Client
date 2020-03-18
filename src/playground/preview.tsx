import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import XMLBuilder from '@shared/components/layout/XMLBuilder';
import LZString from 'lz-string';

const Container = styled.div`
  background-color: white;
`;

/**
 * 一个简化版的XMLBuilder 仅用于显示预览
 */
const ActorTemplatePreviewer = React.memo(() => {
  const [code, setCode] = useState('');

  useEffect(() => {
    // 尝试载入url中的code
    const hash = window.location.hash;
    if (hash.startsWith('#code')) {
      const codehash = hash.split('/')[1] ?? '';
      setCode(LZString.decompressFromEncodedURIComponent(codehash));
    }
  }, []);

  return (
    <Container>
      <XMLBuilder layoutType={'edit'} xml={code} />
    </Container>
  );
});

export default ActorTemplatePreviewer;
