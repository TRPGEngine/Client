import {
  TiledMapOptions,
  TokenAttrs,
  TiledMapActions,
  LayerAttrs,
} from './types';
import { TiledMapRender } from './render';
import _isNil from 'lodash/isNil';
import { Toolbox } from './toolbox';
import { LayerManager } from '../layer/manager';
import { Layer } from '../layer/Layer';
import { Token } from '../layer/token';

/**
 * TiledMap统一管理类
 * 包括工具，渲染
 */
export class TiledMapManager {
  static defaultOptions: Partial<TiledMapOptions> = {
    ratio: window.devicePixelRatio ?? 1,
    axis: {
      padding: {
        x: 10,
        y: 10,
      },
    },
  };

  public render: TiledMapRender;
  public toolbox: Toolbox;
  private layerManager = new LayerManager();
  public selectedToken: Token[] = [];

  constructor(public el: HTMLCanvasElement, public options: TiledMapOptions) {
    this.options = {
      ...TiledMapManager.defaultOptions,
      ...options,
    };
    this.render = new TiledMapRender(el, this.options);
    this.render.manager = this;
    this.render.layerManager = this.layerManager;

    this.toolbox = new Toolbox(this);
    this.initEventListener();
  }

  private initEventListener() {
    this.el.addEventListener('mousedown', (e) => {
      const { clientX: x, clientY: y } = e;
      // const { x: prevX, y: prevY } = this.render.position;

      const activityTool = this.toolbox.getCurrentTool();
      if (!_isNil(activityTool)) {
        const pxPos = { x, y };
        const drawContext = this.render.getDrawContext();
        activityTool.action({
          ...drawContext,
          manager: this,
          layerManager: this.layerManager,
          mousePos: pxPos,
          mouseCanvasPos: this.render.transformMousePosToCanvasPos(pxPos),
        });
      }
    });
  }

  public addLayer(name: string): Layer {
    const layer = new Layer(name);
    this.layerManager.appendLayer(layer);
    this.callActionCallback('onAddLayer', layer);

    return layer;
  }

  public updateLayer(name: string, attrs: LayerAttrs) {
    this.layerManager.updateLayer(name, attrs);
    this.callActionCallback('onUpdateLayer', name, attrs);
  }

  public removeLayer(name: string) {
    this.layerManager.removeLayer(name);
    this.callActionCallback('onRemoveLayer', name);
  }

  /**
   * 增加一个棋子
   * @param layerName 层名
   * @param token 棋子实例
   */
  public addToken(layerName: string, token: Token): void {
    token.prepare().then(() => {
      // 当 token 准备完毕后增加到层中并绘制
      const layer = this.layerManager.getLayer(layerName);
      layer.appendToken(token);
      this.callActionCallback('onAddToken', token);

      this.render.draw(); // 重新绘制图像
    });
  }

  /**
   * 移除一个棋子
   * @param token 棋子
   */
  public removeToken(token: Token): void {
    const layers = this.layerManager.getAllLayers();
    for (const layer of layers) {
      if (layer.hasToken(token)) {
        layer.removeToken(token);
        this.callActionCallback('onRemoveToken', token.id);

        this.render.draw(); // 重新绘制图像
        return;
      }
    }
  }

  /**
   * 更新一个棋子 主要是通知
   * @param token 棋子
   */
  public updateToken(tokenId: string, attrs: Partial<TokenAttrs>): void {
    this.callActionCallback('onUpdateToken', tokenId, attrs);
  }

  /**
   * 移除所有选中的棋子
   */
  public removeSelectedToken(): void {
    for (const token of this.selectedToken) {
      this.removeToken(token);
    }
  }

  private callActionCallback<T extends keyof TiledMapActions>(
    actionName: T,
    ...args: Parameters<TiledMapActions[T]>
  ) {
    const fn = this.options.actions?.[actionName];
    if (_isNil(fn)) {
      console.warn('操作没有注册:', actionName);
      return;
    }

    fn.call(this, ...args);
  }
}
