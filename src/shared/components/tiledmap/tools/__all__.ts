import { TiledMapManager } from '../core/manager';
import { TiledMapToolMove } from './move';

export function regAllTool(manager: TiledMapManager) {
  manager.regTool(new TiledMapToolMove());

  manager.setCurrentTool('move');
}
