import { Layer } from './layer';
import { DrawContext } from '../core/render';
import _pull from 'lodash/pull';
import _orderBy from 'lodash/orderBy';
import { Position, Rect, LayerAttrs } from '../core/types';
import { BaseToken } from './token/BaseToken';

export class LayerManager {
  layers: Layer[] = [];
  readonly defaultLayer: Layer;

  constructor() {
    this.defaultLayer = new Layer('默认', 'default'); // 默认层是id为default的层
    this.appendLayer(this.defaultLayer);
  }

  /**
   * 获取Token所在的层
   */
  getTokenLayerByTokenId(tokenId: string): Layer | null {
    for (const layer of this.layers) {
      if (layer.hasToken(tokenId)) {
        return layer;
      }
    }

    return null;
  }

  /**
   * 精确获取Token
   * @param layerId 层id
   * @param tokenId token id
   */
  getTokenExact(
    layerId: string,
    tokenId: string
  ): BaseToken | null | undefined {
    return this.getLayer(layerId)?.getToken(tokenId);
  }

  /**
   * 追加层
   */
  appendLayer(layer: Layer) {
    this.layers.push(layer);
  }

  /**
   * 更新层
   * @param layerName
   */
  updateLayer(layerId: string, attrs: LayerAttrs) {
    // TODO
  }

  /**
   * 移除层
   * @param layerName 层名
   */
  removeLayer(layerId: string) {
    const layer = this.getLayer(layerId);
    _pull(this.layers, layer);
  }

  getLayer(layerId: string): Layer | null {
    return this.layers.find((layer) => layer.id === layerId) ?? null;
  }

  getLayerByName(layerName: string) {
    return this.layers.find((layer) => layer.name === layerName);
  }

  /**
   * 返回排序后的所有层
   * 排序顺序为降序，即index高的在前低的在后
   */
  getAllLayers(): Layer[] {
    return _orderBy(this.layers, 'index', 'desc');
  }

  drawLayer(ctx: DrawContext) {
    this.getAllLayers()
      .reverse()
      .forEach((layer) => {
        layer.drawAllToken(ctx);
      });
  }

  /**
   * 根据网格坐标获取最上层的Token
   * @param gridPos 网格坐标
   */
  getLayerTokenByGridPosition(gridPos: Position): BaseToken | null {
    const layers = this.getAllLayers();

    for (const layer of layers) {
      const tokens = [...layer.tokens].reverse(); // 从后往前选。这样后渲染的(显示在上面的)会优先被选中，更加符合直觉
      for (const token of tokens) {
        if (token.checkPosInside(gridPos)) {
          return token;
        }
      }
    }

    return null;
  }

  /**
   * 根据网格坐标获取最上层的Token
   * @param gridPos 网格坐标
   */
  getLayerTokenByGridRectRange(rangeRect: Rect): BaseToken[] {
    const layers = this.getAllLayers();

    const ret: BaseToken[] = [];
    for (const layer of layers) {
      const tokens = layer.tokens;

      for (const token of tokens) {
        if (token.checkIsInsideRange(rangeRect)) {
          ret.push(token);
        }
      }
    }

    return ret;
  }
}
