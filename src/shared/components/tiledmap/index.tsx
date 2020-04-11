import React, { useRef, useEffect, useCallback, Fragment } from 'react';
import { TiledMapManager } from './core/manager';
import './index.less';
import { useKeyPressEvent, useKey, useLocalStorage } from 'react-use';
import _isNil from 'lodash/isNil';
import _isFunction from 'lodash/isFunction';
import { joinMapRoom, updateToken, registerMapEventListener } from './socket';
import { message } from 'antd';
import { TiledMapMode } from './core/types';
import { BaseToken } from './layer/token/BaseToken';
import { ImageToken } from './layer/token/ImageToken';

/**
 * 按下空格键临时切换当前道具
 */
function useTmpToolSwitch(manager: React.MutableRefObject<TiledMapManager>) {
  const tmpSwitchRef = useRef<boolean>(false); // 标识当前是否为临时切换(通过按空格)
  const handleSpaceKeydown = useCallback(() => {
    if (!_isNil(manager.current)) {
      if (manager.current.toolbox.getCurrentToolName() === 'select') {
        manager.current.toolbox.setCurrentTool('move');
        tmpSwitchRef.current = true;
      }
    }
  }, [manager]);
  const handleSpaceKeyup = useCallback(() => {
    if (!_isNil(manager.current) && tmpSwitchRef.current === true) {
      if (manager.current.toolbox.getCurrentToolName() === 'move') {
        manager.current.toolbox.setCurrentTool('select');
        tmpSwitchRef.current = false;
      }
    }
  }, [manager]);
  useKeyPressEvent(' ', handleSpaceKeydown, handleSpaceKeyup);
}

function useDeleteToken(manager: React.MutableRefObject<TiledMapManager>) {
  const handler = useCallback(() => {
    if (_isNil(manager.current)) {
      return;
    }

    manager.current.removeSelectedToken();
  }, [manager]);
  useKey('Delete', handler);
}

/**
 * 测试按钮
 */
function useTestTokenBtn(
  tiledMapManagerRef: React.MutableRefObject<TiledMapManager>,
  mode: TiledMapMode
) {
  const [isDebug] = useLocalStorage('__tiledMapDebug', false);
  const testTokenRefs = useRef<BaseToken[]>([]);
  const handleAppendToken = useCallback(() => {
    const name = Math.random()
      .toString()
      .substr(2);
    const token = new ImageToken();
    token.imageSrc = `https://trpgapi.moonrailgun.com/file/avatar/svg?name=${name}`;
    // 生成随机坐标
    const x = Math.floor(Math.random() * 20);
    const y = Math.floor(Math.random() * 15);
    token.gridPosition = { x, y };
    token.buildPromise();

    tiledMapManagerRef.current?.addToken(
      tiledMapManagerRef.current?.getDefaultLayer().id,
      token
    );
    message.success(
      `增加Token ${token.id} [${token.gridPosition.x},${token.gridPosition.y}]`
    );
    testTokenRefs.current.push(token);
  }, [tiledMapManagerRef]);
  const handleRemoveToken = useCallback(() => {
    const token = testTokenRefs.current.shift();
    if (_isNil(token)) {
      return;
    }

    tiledMapManagerRef.current?.removeToken(token);
  }, [tiledMapManagerRef]);

  return (
    isDebug &&
    mode === 'edit' && (
      <Fragment>
        <button onClick={handleAppendToken}>增加Token</button>
        <button onClick={handleRemoveToken}>移除Token</button>
      </Fragment>
    )
  );
}

interface TiledMapProps {
  mapUUID: string;
  jwt?: string; // 授权
  mode?: TiledMapMode;
  onLoad?: (manager: TiledMapManager) => void;
}
export const TiledMap: React.FC<TiledMapProps> = React.memo((props) => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const tiledMapManagerRef = useRef<TiledMapManager>();

  const { mapUUID, jwt, mode, onLoad } = props;

  useEffect(() => {
    if (_isNil(mapUUID)) {
      return;
    }

    joinMapRoom(mapUUID)
      .then((mapData) => {
        message.success(`连接地图 ${mapUUID} 成功`);
        const manager = tiledMapManagerRef.current;
        registerMapEventListener(mapUUID, manager.handleReceiveModifyToken);

        // 应用地图数据
        manager.applyMapData(mapData);
      })
      .catch((e) => {
        message.error(String(e));
      });
  }, [mapUUID]);

  useEffect(() => {
    const tiledMapManager = new TiledMapManager(canvasRef.current, {
      mode, // 只取加载时获取到的mode。不接受修改
      size: {
        width: 20,
        height: 15,
      },
      gridSize: {
        width: 40,
        height: 40,
      },
      actions: {
        onAddToken(layerId, token) {
          console.log('addToken', token);
          updateToken('add', {
            jwt,
            layerId,
            token: token.getData(),
          }).catch((e) => message.error(e));
        },
        onUpdateToken(layerId, tokenId, tokenAttrs) {
          console.log('updateToken', tokenId, tokenAttrs);
          updateToken('update', {
            jwt,
            layerId,
            tokenId,
            tokenAttrs,
          }).catch((e) => message.error(e));
        },
        onRemoveToken(layerId, tokenId) {
          console.log('updateToken', tokenId);
          updateToken('remove', { jwt, layerId, tokenId }).catch((e) =>
            message.error(e)
          );
        },
        onAddLayer(layer) {
          // TODO
          console.log('addLayer', layer);
        },
        onUpdateLayer(layerId, attrs) {
          // TODO
          console.log('updateLayer', layerId, attrs);
        },
        onRemoveLayer(layerId) {
          // TODO
          console.log('removeLayer', layerId);
        },
      },
    });
    tiledMapManagerRef.current = tiledMapManager;
    (window as any).tiledMapManager = tiledMapManager; // debug
    _isFunction(onLoad) && onLoad(tiledMapManager);
  }, []);

  useTmpToolSwitch(tiledMapManagerRef);
  useDeleteToken(tiledMapManagerRef);

  return (
    <div className="tiledmap">
      <canvas ref={canvasRef}>请使用现代浏览器打开本页面</canvas>
      {useTestTokenBtn(tiledMapManagerRef, mode)}
    </div>
  );
});
TiledMap.defaultProps = {
  mode: 'preview',
};

TiledMap.displayName = 'TiledMap';
