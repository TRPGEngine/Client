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

type EmitResponse = EmitSuccessResponse | EmitErrorResponse;

const platformSocketParam: SocketIOClient.ConnectOpts = {
  jsonp: false,
  transports: ['websocket'],
};

type SocketOnFunc = (
  event: string,
  fn: (data: { [key: string]: any }) => void
) => void;

export class API {
  serverUrl = `${config.io.protocol}://${config.io.host}:${config.io.port}`;
  socket = io(this.serverUrl, platformSocketParam);
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

  emitP(this: API, event: string, data?: {}): Promise<EmitSuccessResponse> {
    return new Promise((resolve, reject) => {
      this.emit(event, data, (res: EmitResponse) => {
        if (res.result === false) {
          reject(res.msg);
        } else {
          resolve(res);
        }
      });
    });
  }

  on: SocketOnFunc = this.socket.on.bind(this.socket);

  /**
   * 修改远程服务地址并重新连接
   * @param url 远程服务地址
   */
  reconnect(url: string) {
    if (this.serverUrl !== url) {
      console.log('正在使用新的地址重新连接', url);
      this.serverUrl = url;
      this.socket.close();
      this.socket = io(url, platformSocketParam);
    } else {
      console.log('地址没有变更, 跳过');
    }
  }
}
