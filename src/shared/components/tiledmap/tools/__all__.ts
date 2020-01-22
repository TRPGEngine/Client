import { Toolbox } from '../core/toolbox';
import { TiledMapToolMove } from './move';

export function regAllTool(toolbox: Toolbox) {
  toolbox.regTool(new TiledMapToolMove());

  toolbox.setCurrentTool('move');
}
