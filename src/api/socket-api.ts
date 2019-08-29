import * as io from 'socket.io-client';
import config from '../../config/project.config';

const platformSocketParam = {
  jsonp: false,
};

export class API {
  serverUrl = `${config.io.protocol}://${config.io.host}:${config.io.port}`;
  socket = io(this.serverUrl, platformSocketParam);
  handleEventError: any;

  emit(event: string, data: {}, cb?: (res: any) => void) {
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

  on = this.socket.on.bind(this.socket);
}
