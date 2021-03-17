import io from 'socket.io-client';
import config from '../project.config';
import { showLimitedToasts } from '@shared/utils/ui';
import { errorCode } from '@shared/utils/error';

interface EmitSuccessResponse {
  result: true;
  [key: string]: any;
}

interface EmitErrorResponse {
  result: false;
  msg: string;
}

type EmitResponse<T = unknown> = (EmitSuccessResponse & T) | EmitErrorResponse;

const platformSocketParam: SocketIOClient.ConnectOpts = {
  jsonp: false,
  transports: ['websocket'],
};

type SocketOnFunc = (
  event: string,
  fn: (data: { [key: string]: any }) => void
) => void;

export class API {
  public static serviceUrl = `${config.io.protocol}://${config.io.host}:${config.io.port}`;

  socket = io(API.serviceUrl, platformSocketParam);
  handleEventError: any;

  emit(event: string, data?: {} | null, cb?: (res: any) => void) {
    if (this.socket.disconnected) {
      this.socket.connect();
    }
    return this.socket.emit(event, data, (res) => {
      cb && cb(res);

      if (res.result === false) {
        // 如果检测到错误则汇报错误信息
        const info = `${res.msg}\n事件: ${event}\n发送信息: ${JSON.stringify(
          data
        )}`;
        this.handleEventError && this.handleEventError(info);
        if (res.code === errorCode.LIMITED) {
          // limited
          showLimitedToasts();
        }
      }
    });
  }

  emitP<T>(
    this: API,
    event: string,
    data?: {}
  ): Promise<EmitSuccessResponse & T> {
    return new Promise((resolve, reject) => {
      this.emit(event, data, (res: EmitResponse<T>) => {
        if (res.result === false) {
          reject(res.msg);
        } else {
          resolve(res);
        }
      });
    });
  }

  on: SocketOnFunc = this.socket.on.bind(this.socket);
}
