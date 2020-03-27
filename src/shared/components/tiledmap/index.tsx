import React, { useRef, useEffect, useCallback } from 'react';
import { TiledMapManager } from './core/manager';
import './index.less';
import { ImageToken, Token } from './layer/token';
import { useKey, useKeyPressEvent } from 'react-use';
import _isNil from 'lodash/isNil';

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
  }, []);
  const handleSpaceKeyup = useCallback(() => {
    if (!_isNil(manager.current) && tmpSwitchRef.current === true) {
      if (manager.current.toolbox.getCurrentToolName() === 'move') {
        manager.current.toolbox.setCurrentTool('select');
        tmpSwitchRef.current = false;
      }
    }
  }, []);
  useKeyPressEvent(' ', handleSpaceKeydown, handleSpaceKeyup);
}

export const TiledMap: React.FC = React.memo((props) => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const manager = useRef<TiledMapManager>(null);
  const tiledMapManagerRef = useRef<TiledMapManager>();

  useEffect(() => {
    const tiledMapManager = new TiledMapManager(canvasRef.current, {
      size: {
        width: 20,
        height: 15,
      },
      gridSize: {
        width: 40,
        height: 40,
      },
    });
    tiledMapManagerRef.current = tiledMapManager;

    // ------------ test ------------
    const layer = tiledMapManager.addLayer('人物');
    const testToken = new ImageToken(
      '测试人物',
      'https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2807058697,2434741312&fm=58'
    );
    testToken.gridPosition = {
      x: 2,
      y: 4,
    };
    tiledMapManager.addToken('人物', testToken);

    const layer2 = tiledMapManager.addLayer('背景');
    layer2.index = -1; // 应在人物下面
    const testToken2 = new ImageToken(
      '测试背景',
      'https://www.dytt8.net/images/m.jpg'
    );
    testToken2.gridPosition = {
      x: 1,
      y: 1,
    };
    tiledMapManager.addToken('背景', testToken2);

    // ------------ test ------------

    manager.current = tiledMapManager;
  }, []);

  useTmpToolSwitch(manager);

  /**
   * 测试
   */
  const testTokenRefs = useRef<Token[]>([]);
  const handleAppendToken = useCallback(() => {
    const name = Math.random()
      .toString()
      .substr(2);
    const token = new ImageToken(
      name,
      `https://trpgapi.moonrailgun.com/file/avatar/svg?name=${name}`
    );

    // 生成随机坐标
    const x = Math.floor(Math.random() * 20);
    const y = Math.floor(Math.random() * 20);
    token.gridPosition = { x, y };

    tiledMapManagerRef.current?.addToken('人物', token);
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
    <div className="tiledmap">
      <canvas ref={canvasRef}>请使用现代浏览器打开本页面</canvas>
      <button onClick={handleAppendToken}>增加Token</button>
      <button onClick={handleRemoveToken}>移除Token</button>
    </div>
  );
});
TiledMap.displayName = 'TiledMap';
