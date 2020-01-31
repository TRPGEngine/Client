import { Layer } from './Layer';
import { DrawContext } from '../core/render';
import _orderBy from 'lodash/orderBy';
import { Position } from '../core/types';
import { Token } from './token';

export class LayerManager {
  layers: Layer[] = [];

  appendLayer(layer: Layer) {
    this.layers.push(layer);
  }

  getLayer(name: string) {
    return this.layers.find((layer) => layer.name === name);
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
  getLayerTokenByGridPosition(gridPos: Position): Token | null {
    const layers = this.getAllLayers();

    for (const layer of layers) {
      const tokens = layer.tokens;
      for (const token of tokens) {
        if (token.checkPosInside(gridPos)) {
          return token;
        }
      }
    }

    return null;
  }
}
