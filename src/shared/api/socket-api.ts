import io from 'socket.io-client';
import config from '../project.config';

const platformSocketParam = {
  jsonp: false,
};

type SocketOnFunc = (
  event: string,
  fn: (data: { [key: string]: any }) => void
) => void;

export class API {
  serverUrl = `${config.io.protocol}://${config.io.host}:${config.io.port}`;
  socket = io(this.serverUrl, platformSocketParam);
  handleEventError: any;

  emit(event: string, data?: {}, cb?: (res: any) => void) {
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
      }
    });
  }

  emitP(this: API, event: string, data?: {}): Promise<any> {
    return new Promise((resolve, reject) => {
      this.emit(event, data, (res) => {
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
