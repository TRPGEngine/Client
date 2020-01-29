import { Layer } from './Layer';
import { DrawContext } from '../core/render';
import _orderBy from 'lodash/orderBy';

export class LayerManager {
  layers: Layer[] = [];

  appendLayer(layer: Layer) {
    this.layers.push(layer);
  }

  getLayer(name: string) {
    return this.layers.find((layer) => layer.name === name);
  }

  drawLayer(ctx: DrawContext) {
    _orderBy(this.layers, 'index', 'asc').forEach((layer) => {
      layer.drawAllToken(ctx);
    });
  }
}
