import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 10px 20px;

  h2 {
    text-align: center;
  }
`;

const ImageDisclaimer: React.FC = React.memo(() => {
  return (
    <Container>
      <h2>图片声明</h2>
      <p>
        因为服务器成本的控制以及可能存在的版权问题。TRPG
        Engine不会提供除头像上传以外的图片服务。推荐用户自行寻找第三方图床进行图片的交流服务
      </p>
      <p>在聊天中插入图片的方法: [img]这里是图片的地址[/img]</p>
      <p>
        推荐的可靠稳定的免费图床: <a href="https://sm.ms/">sm.ms</a>
      </p>
    </Container>
  );
});

export default ImageDisclaimer;
