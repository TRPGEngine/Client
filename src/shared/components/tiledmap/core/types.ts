import { Token } from '../layer/token';
import { Layer } from '../layer/layer';

export interface Size {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}
export type Axios = Position;

export interface TokenAttrs {
  gridPosition: Position;
  gridAreaSize: Size;
}

export interface LayerAttrs {
  _id: string,
  name: string,
  index: number,
  desc: string
}

export interface TiledMapActions {
  // 用于通知外部TiledMap进行了那些操作
  onAddToken: (token: Token) => void;
  onUpdateToken: (tokenId: string, attrs: Partial<TokenAttrs>) => void;
  onRemoveToken: (tokenId: string) => void;
  onAddLayer: (layer: Layer) => void;
  onUpdateLayer: (layerName: string, attrs: Partial<LayerAttrs>) => void;
  onRemoveLayer: (layerName: string);
}
export interface TiledMapOptions {
  size: Size; // 格子数
  gridSize: Size;
  ratio?: number; // 绘制精度, 越大越精细但是消耗资源越高
  axis?: {
    padding: Axios;
  };
  actions?: Partial<TiledMapActions>;
}

export interface Rect {
  x1: number; // 左上角x
  y1: number; // 左上角y
  x2: number; // 右上角x
  y2: number; // 右上角y
}
