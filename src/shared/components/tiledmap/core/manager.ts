import {
  TiledMapOptions,
  TokenAttrs,
  TiledMapActions,
  LayerAttrs,
  TiledMapData,
} from './types';
import { TiledMapRender } from './render';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import { Toolbox } from './toolbox';
import { LayerManager } from '../layer/manager';
import { Layer } from '../layer/Layer';
import { Token, ImageToken } from '../layer/token';

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

  /**
   * 初始化事件监听器
   */
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

  /**
   * 应用地图数据
   * @param mapData 地图数据
   */
  public applyMapData(mapData: TiledMapData) {
    const layers = mapData.layers;
    for (const layerData of layers) {
      // 应用层数据
      let layer = this.layerManager.getLayer(layerData._id);
      if (_isNil(layer)) {
        layer = new Layer(layerData.name, layerData._id);
        layer.parseData(layerData);
        this.layerManager.appendLayer(layer);
      }

      // 应用棋子数据
      for (const tokenData of layerData.tokens) {
        if (layer.hasToken(tokenData._id)) {
          // 如果已存在Token则更新
          layer.getToken(tokenData._id).parseData(tokenData);
        } else {
          // 如果不存在则新建
          let newToken: Token;
          const tokenType = tokenData._type;
          if (tokenType === 'imageToken') {
            newToken = new ImageToken(
              _get(tokenData, 'imageSrc'),
              tokenData._id
            );
          } else {
            newToken = new Token(tokenData._id);
          }
          newToken.parseData(tokenData);
          this.addToken(layer.id, newToken, false);
        }
      }
    }
  }

  /**
   * 获取默认层
   */
  public getDefaultLayer(): Layer {
    return this.layerManager.defaultLayer;
  }

  /**
   * 新增层
   */
  public addLayer(name: string, id?: string): Layer {
    if (this.layerManager.getLayer(id)) {
      console.warn(`layer: ${id} 已存在`);
      return;
    }

    const layer = new Layer(name, id);
    this.layerManager.appendLayer(layer);
    this.callActionCallback('onAddLayer', layer);

    return layer;
  }

  /**
   * 更新层
   */
  public updateLayer(id: string, attrs: LayerAttrs) {
    this.layerManager.updateLayer(id, attrs);
    this.callActionCallback('onUpdateLayer', id, attrs);
  }

  /**
   * 移除层
   */
  public removeLayer(id: string) {
    this.layerManager.removeLayer(id);
    this.callActionCallback('onRemoveLayer', id);
  }

  /**
   * 增加一个棋子
   * @param layerName 层名
   * @param token 棋子实例
   * @param notify 是否通知 默认为通知 主要用于初始化地图时不进行通知
   */
  public async addToken(
    layerId: string,
    token: Token,
    notify = true
  ): Promise<void> {
    const layer = this.layerManager.getLayer(layerId);
    if (layer.hasToken(token.id)) {
      console.warn(`[layer: ${layerId}]Token 已存在: ${token.id}`);
      return;
    }

    await token.prepare().then(() => {
      // 当 token 准备完毕后增加到层中并绘制

      layer.appendToken(token);
      if (notify) {
        this.callActionCallback('onAddToken', layerId, token);
      }

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
      if (layer.hasToken(token.id)) {
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
