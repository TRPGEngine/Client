import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { TiledMap } from '@shared/components/tiledmap';
import { RouteComponentProps } from 'react-router-dom';
import { fetchGroupActorList } from '@portal/model/group';
import { GroupActorItem } from '@shared/model/group';
import _isNil from 'lodash/isNil';
import _isFunction from 'lodash/isFunction';
import SplitPane from '@shared/components/web/SplitPane';
import { handleError } from '@web/utils/error';
import { TiledMapManager } from '@shared/components/tiledmap/core/manager';
import { checkToken } from '@portal/utils/auth';
import { TMemo } from '@shared/components/TMemo';
import { TokenPicker } from './tools/TokenPicker';
import styled from 'styled-components';
import { Connects } from './tools/Connects';
import { getUserJWT } from '@shared/utils/jwt-helper';

const TiledMapContainer = styled.div`
  height: 100%;

  .connects-container {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
`;

interface Props
  extends RouteComponentProps<{
    groupUUID: string;
    mapUUID: string;
  }> {}
const MapEditor: React.FC<Props> = TMemo((props) => {
  const { groupUUID, mapUUID } = props.match.params;
  const [jwt, setJWT] = useState<string>();
  const [actors, setActors] = useState<GroupActorItem[]>([]);
  const tiledMapManagerRef = useRef<TiledMapManager>();

  useEffect(() => {
    if (_isNil(groupUUID)) {
      console.warn('没有获取到团UUID');
      return;
    }

    checkToken()
      .then(() => getUserJWT())
      .then((jwt) => setJWT(jwt));

    fetchGroupActorList(groupUUID)
      .then((list) => setActors(list))
      .catch(handleError);
  }, []);

  const handleLoad = useCallback((manager: TiledMapManager) => {
    console.log('manager', manager); // for debug
    tiledMapManagerRef.current = manager;
  }, []);

  const tiledMapEl = useMemo(
    () =>
      jwt && (
        <TiledMap mapUUID={mapUUID} jwt={jwt} mode="edit" onLoad={handleLoad} />
      ),
    [mapUUID, jwt, handleLoad]
  );

  return (
    <SplitPane split="vertical" primary="second" defaultSize={300}>
      <TiledMapContainer>
        {tiledMapEl}
        <div className="connects-container">
          <Connects mapUUID={mapUUID} />
        </div>
      </TiledMapContainer>
      <div>
        <TokenPicker actors={actors} tiledMapManagerRef={tiledMapManagerRef} />
      </div>
    </SplitPane>
  );
});
MapEditor.displayName = 'MapEditor';

export default MapEditor;
