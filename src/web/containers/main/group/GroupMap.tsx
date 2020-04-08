import React, { useMemo, useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useAlphaUser } from '@shared/hooks/useAlphaUser';
import IsDeveloping from '@web/components/IsDeveloping';
import { useCurrentGroupInfo } from '@app/redux/hooks/useCurrentGroupInfo';
import _isEmpty from 'lodash/isEmpty';
import { Button, Card } from 'antd';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { CreateGroupMap } from './modal/CreateGroupMap';
import { showModal } from '@shared/redux/actions/ui';
import styled from 'styled-components';

const Container = styled.div`
  padding: 10px;
`;

const MapItem = styled(Card)`
  margin: 10px 0 !important;
`;

export const GroupMap: React.FC = TMemo(() => {
  const { isAlphaUser } = useAlphaUser();

  // 获取地图列表
  const groupInfo = useCurrentGroupInfo();
  const groupUUID = groupInfo.uuid;
  const mapList = groupInfo.maps;
  const dispatch = useTRPGDispatch();

  const handleCreateGroupMap = useCallback(() => {
    dispatch(showModal(<CreateGroupMap groupUUID={groupUUID} />));
  }, [groupUUID]);

  const mapListEl = useMemo(() => {
    if (_isEmpty(mapList)) {
      return <p>暂无地图</p>;
    }

    return mapList.map((map) => {
      return (
        <MapItem key={map.uuid}>
          <p>{map.name}</p>
        </MapItem>
      );
    });
  }, [mapList]);

  if (!isAlphaUser) {
    return <IsDeveloping />;
  }

  return (
    <Container>
      <Button onClick={handleCreateGroupMap} block={true}>
        新建地图
      </Button>
      {mapListEl}
    </Container>
  );
});
GroupMap.displayName = 'GroupMap';
