import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { RouteComponentProps } from 'react-router';
import { Result } from 'antd';
import { useResultParams } from '@portal/hooks/useResultParams';

interface Props extends RouteComponentProps {}
const ResultError: React.FC<Props> = TMemo(() => {
  const { title = '操作失败', subTitle } = useResultParams();

  return <Result status="error" title={title} subTitle={subTitle} />;
});
ResultError.displayName = 'ResultError';

export default ResultError;
