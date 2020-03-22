import React from 'react';
import { RenderErrorComponent } from '@shared/components/ErrorBoundary';
import { Text, ScrollView } from 'react-native';
import _get from 'lodash/get';

const ErrorView: RenderErrorComponent = (props) => {
  return (
    <ScrollView>
      <Text style={{ fontSize: 24 }}>错误!</Text>
      <Text>
        如果看到这个界面，说明应用发生了不可预知的错误。在大多数情况下重启应用都能解决这个问题。如果这个问题反复出现，请试图联系开发者
      </Text>
      <Text>{_get(props, 'error.message')}</Text>
      <Text>{_get(props, 'info.componentStack')}</Text>
    </ScrollView>
  );
};

export default ErrorView;
