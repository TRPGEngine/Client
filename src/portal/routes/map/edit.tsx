import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { TiledMap } from '@shared/components/tiledmap';
import { RouteComponentProps } from 'react-router-dom';
import { fetchGroupActorList, GroupActorItem } from '@portal/model/group';
import _isNil from 'lodash/isNil';
import _isFunction from 'lodash/isFunction';
import SplitPane from '@shared/components/web/SplitPane';
import { Collapse } from 'antd';
import { handleError } from '@portal/utils/error';
import { TiledMapManager } from '@shared/components/tiledmap/core/manager';
import { checkToken, getToken } from '@portal/utils/auth';
import { TMemo } from '@shared/components/TMemo';
import { TokenPicker } from './tools/TokenPicker';

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
      .then(() => getToken())
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
      <div style={{ height: '100%' }}>{tiledMapEl}</div>
      <div>
        <TokenPicker actors={actors} tiledMapManagerRef={tiledMapManagerRef} />
      </div>
    </SplitPane>
  );
});
MapEditor.displayName = 'MapEditor';

export default MapEditor;
