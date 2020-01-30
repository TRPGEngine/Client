import { Toolbox } from '../core/toolbox';
import { TiledMapToolMove } from './move';
import { TiledMapToolSelect } from './select';

export function regAllTool(toolbox: Toolbox) {
  toolbox.regTool(new TiledMapToolSelect());
  toolbox.regTool(new TiledMapToolMove());

  toolbox.setCurrentTool('move');
}
