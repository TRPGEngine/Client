import config from '@shared/project.config';

export class API {
  public static serviceUrl = `${config.io.protocol}://${config.io.host}:${config.io.port}`;

  socket = null;
  handleEventError: any;

  emit = jest.fn();
  emitP = jest.fn();
  on = jest.fn();
}
