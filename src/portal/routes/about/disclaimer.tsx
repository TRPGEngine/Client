import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 10px 20px;

  h2 {
    text-align: center;
  }
`;

const Disclaimer: React.FC = React.memo(() => {
  return (
    <Container>
      <h2>免责声明</h2>
      <p>
        本应用部分数据来源于网络或用户自主上传，仅供学习参考使用，并适用避风港原则。如有触及到侵权的行为，请联系开发者并提供侵权证据，会立即删除。
      </p>
    </Container>
  );
});

export default Disclaimer;
