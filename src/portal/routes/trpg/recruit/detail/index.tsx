import React, { useEffect, useState } from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { TMemo } from '@shared/components/TMemo';
import { fetchUserRecruitDetail, RecruitItemType } from '@shared/model/trpg';
import { RecruitItem } from '../RecruitItem';
import _isNil from 'lodash/isNil';
import Loading from '@portal/components/Loading';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

type Props = RouteComponentProps<{
  recruitUUID: string;
}>;
const RecruitDetail: React.FC<Props> = TMemo((props) => {
  const recruitUUID = props.match.params.recruitUUID;
  const [recruit, setRecruit] = useState<RecruitItemType>();

  useEffect(() => {
    fetchUserRecruitDetail(recruitUUID).then((recruit) => setRecruit(recruit));
  }, [recruitUUID]);

  return (
    <Container>
      {_isNil(recruit) ? (
        <Loading />
      ) : (
        <RecruitItem data={recruit} size="large" />
      )}
    </Container>
  );
});
RecruitDetail.displayName = 'RecruitDetail';

export default RecruitDetail;
