import React from 'react';
import { View } from 'react-native';
import _get from 'lodash/get';
import Base from './Base';
import { Progress } from '@ant-design/react-native';
import styled from 'styled-components/native';

const LoadingTip = styled.Text`
  font-size: 12px;
`;

const ProgressContainer = styled.View`
  height: 4px;
  width: 120px;
`;

class Loading extends Base {
  getContent() {
    const percent = _get(this.props, 'info.data.progress', 0) * 100;
    const percentText = percent > 0 ? Number(percent.toFixed(2)) + '%' : '';

    return (
      <View>
        <LoadingTip>处理中...{percentText}</LoadingTip>
        <ProgressContainer>
          <Progress percent={percent} position="normal" />
        </ProgressContainer>
      </View>
    );
  }
}

export default Loading;
