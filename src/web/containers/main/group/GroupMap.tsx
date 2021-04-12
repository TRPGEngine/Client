import React, { useMemo, useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useAlphaUser } from '@shared/hooks/useAlphaUser';
import IsDeveloping from '@web/components/IsDeveloping';
import { useSelectedGroupInfo } from '@redux/hooks/group';
import _isEmpty from 'lodash/isEmpty';
import { Button, Card } from 'antd';
import { useTRPGDispatch } from '@redux/hooks/useTRPGSelector';
import { CreateGroupMap } from './modal/CreateGroupMap';
import { showModal } from '@shared/redux/actions/ui';
import styled from 'styled-components';
import { showPortal } from '@web/redux/action/ui';
import { getPortalUrl } from '@shared/utils/string-helper';
import { useIsGroupManager } from '@redux/hooks/group';

const Container = styled.div`
  padding: 10px;
`;

const MapItem = styled(Card)`
  margin: 10px 0 !important;

  > .ant-card-body {
    display: flex;
    align-items: center;

    > .info {
      flex: 1;
    }

    > .actions {
      display: flex;
      flex-direction: column;

      > button {
        margin-bottom: 4px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
`;

export const GroupMap: React.FC = TMemo(() => {
  const { isAlphaUser } = useAlphaUser();

  // 获取地图列表
  const groupInfo = useSelectedGroupInfo()!;
  const groupUUID = groupInfo.uuid;
  const mapList = groupInfo.maps;
  const dispatch = useTRPGDispatch();
  const isGroupManager = useIsGroupManager(groupUUID);

  const handleCreateGroupMap = useCallback(() => {
    dispatch(showModal(<CreateGroupMap groupUUID={groupUUID} />));
  }, [groupUUID]);

  const handleOpenGroupMap = useCallback(
    (mapUUID) => {
      dispatch(
        showPortal(
          `/group/${groupUUID}/map/${mapUUID}/preview`,
          'standalonewindow'
        )
      );
    },
    [groupUUID]
  );

  const handleOpenGroupMapEdit = useCallback(
    (mapUUID) => {
      window.open(
        getPortalUrl(`/group/${groupUUID}/map/${mapUUID}/edit`),
        'newwindow'
      );
    },
    [groupUUID]
  );

  const mapListEl = useMemo(() => {
    if (_isEmpty(mapList)) {
      return <p>暂无地图</p>;
    }

    return mapList!.map((map) => {
      return (
        <MapItem key={map.uuid}>
          <div className="info">{map.name}</div>
          <div className="actions">
            {isGroupManager && (
              <Button onClick={() => handleOpenGroupMapEdit(map.uuid)}>
                编辑地图
              </Button>
            )}
            <Button onClick={() => handleOpenGroupMap(map.uuid)}>
              打开地图
            </Button>
          </div>
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
