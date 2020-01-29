import { Layer } from './Layer';
import { DrawContext } from '../core/render';

export class LayerManager {
  layers: Layer[] = [];

  appendLayer(layer: Layer) {
    this.layers.push(layer);
  }

  getLayer(name: string) {
    return this.layers.find((layer) => layer.name === name);
  }

  drawLayer(ctx: DrawContext) {
    this.layers.forEach((layer) => layer.drawAllToken(ctx));
  }
}
