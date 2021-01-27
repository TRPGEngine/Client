import type { Layer } from '../layer/layer';
import type { BaseToken } from '../layer/token/BaseToken';

export interface Size {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}
export type Axis = Position;

export interface TokenAttrs {
  _id: string;
  _type: string;
  gridPosition: Position;
  gridAreaSize: Size;
}

export interface TokenData extends Partial<TokenAttrs> {
  [key: string]: any;
}

export interface LayerAttrs {
  _id: string;
  name: string;
  index: number;
  desc: string;
}

export interface TiledMapActions {
  // 用于通知外部TiledMap进行了那些操作
  onAddToken: (layerId: string, token: BaseToken) => void;
  onUpdateToken: (
    layerId: string,
    tokenId: string,
    attrs: Partial<TokenAttrs>
  ) => void;
  onRemoveToken: (layerId: string, tokenId: string) => void;
  onAddLayer: (layer: Layer) => void;
  onUpdateLayer: (layerId: string, attrs: Partial<LayerAttrs>) => void;
  onRemoveLayer: (layerId: string) => void;
}

export type TiledMapMode = 'edit' | 'preview';
export interface TiledMapOptions {
  size: Size; // 格子数
  gridSize: Size;
  mode?: TiledMapMode; // 地图模式。 默认为preview
  ratio?: number; // 绘制精度, 越大越精细但是消耗资源越高
  axis?: {
    padding: Axis;
  };
  actions?: Partial<TiledMapActions>;
}

export interface Rect {
  x1: number; // 左上角x
  y1: number; // 左上角y
  x2: number; // 右上角x
  y2: number; // 右上角y
}

type TiledMapDataToken = TokenAttrs;
export interface TiledMapDataLayer extends LayerAttrs {
  tokens: TiledMapDataToken[];
}
export interface TiledMapData {
  layers: TiledMapDataLayer[];
}
