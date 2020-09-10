import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { RouteComponentProps } from 'react-router';
import { Result } from 'antd';
import { useResultParams } from '@portal/hooks/useResultParams';

interface Props extends RouteComponentProps {}
const ResultSuccess: React.FC<Props> = TMemo(() => {
  const { title = '操作成功', subTitle } = useResultParams();

  return <Result status="success" title={title} subTitle={subTitle} />;
});
ResultSuccess.displayName = 'ResultSuccess';

export default ResultSuccess;
