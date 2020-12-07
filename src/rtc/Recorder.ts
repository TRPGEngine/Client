// 如果需要修改为MP3
// 可以检查: https://www.jb51.net/html5/664755.html

interface RecordConfig {
  sampleBits?: number;
  sampleRate?: number;
}

export class Recorder {
  context: AudioContext;
  audioInput: MediaStreamAudioSourceNode;
  recorder: ScriptProcessorNode;
  audioData: {
    size: number;
    buffer: Float32Array[];
    inputSampleRate: number;
    inputSampleBits: number;
    outputSampleRate: any;
    oututSampleBits: any;
    input(data: any): void;
    compress(): Float32Array;
    encodeWAV(): Blob;
  };

  constructor(stream: MediaStream, config: RecordConfig = {}) {
    const {
      sampleBits = 8, // 采样数位 8, 16
      sampleRate = 44100 / 6, // 采样率(1/6 44100)
    } = config;

    // 创建一个音频环境对象
    const audioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    this.context = new audioContext();

    // 将声音输入这个对像
    this.audioInput = this.context.createMediaStreamSource(stream);

    // 设置音量节点
    const volume = this.context.createGain();
    this.audioInput.connect(volume);

    // 创建缓存，用来缓存声音
    const bufferSize = 4096;

    // 创建声音的缓存节点，createScriptProcessor方法的
    // 第二个和第三个参数指的是输入和输出都是双声道。
    this.recorder = this.context.createScriptProcessor(bufferSize, 2, 2);

    this.audioData = {
      size: 0, // 录音文件长度
      buffer: [] as Float32Array[], // 录音缓存
      inputSampleRate: this.context.sampleRate, // 输入采样率
      inputSampleBits: 16, // 输入采样数位 8, 16
      outputSampleRate: sampleRate, // 输出采样率
      oututSampleBits: sampleBits, // 输出采样数位 8, 16
      input(data) {
        this.buffer.push(new Float32Array(data));
        this.size += data.length;
      },
      compress() {
        // 合并压缩
        // 合并
        const data = new Float32Array(this.size);
        let offset = 0;
        for (let i = 0; i < this.buffer.length; i++) {
          data.set(this.buffer[i], offset);
          offset += this.buffer[i].length;
        }
        // 压缩
        const compression = Math.floor(
          this.inputSampleRate / this.outputSampleRate
        );
        const length = data.length / compression;
        const result = new Float32Array(length);
        let index = 0;
        let j = 0;
        while (index < length) {
          result[index] = data[j];
          j += compression;
          index++;
        }
        return result;
      },
      encodeWAV() {
        const sampleRate = Math.min(
          this.inputSampleRate,
          this.outputSampleRate
        );
        const sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
        const bytes = this.compress();
        const dataLength = bytes.length * (sampleBits / 8);
        const buffer = new ArrayBuffer(44 + dataLength);
        const data = new DataView(buffer);

        const channelCount = 1; // 单声道
        let offset = 0;

        const writeString = function (str) {
          for (let i = 0; i < str.length; i++) {
            data.setUint8(offset + i, str.charCodeAt(i));
          }
        };

        // 资源交换文件标识符
        writeString('RIFF');
        offset += 4;
        // 下个地址开始到文件尾总字节数,即文件大小-8
        data.setUint32(offset, 36 + dataLength, true);
        offset += 4;
        // WAV文件标志
        writeString('WAVE');
        offset += 4;
        // 波形格式标志
        writeString('fmt ');
        offset += 4;
        // 过滤字节,一般为 0x10 = 16
        data.setUint32(offset, 16, true);
        offset += 4;
        // 格式类别 (PCM形式采样数据)
        data.setUint16(offset, 1, true);
        offset += 2;
        // 通道数
        data.setUint16(offset, channelCount, true);
        offset += 2;
        // 采样率,每秒样本数,表示每个通道的播放速度
        data.setUint32(offset, sampleRate, true);
        offset += 4;
        // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8
        data.setUint32(
          offset,
          channelCount * sampleRate * (sampleBits / 8),
          true
        );
        offset += 4;
        // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8
        data.setUint16(offset, channelCount * (sampleBits / 8), true);
        offset += 2;
        // 每样本数据位数
        data.setUint16(offset, sampleBits, true);
        offset += 2;
        // 数据标识符
        writeString('data');
        offset += 4;
        // 采样数据总数,即数据总大小-44
        data.setUint32(offset, dataLength, true);
        offset += 4;
        // 写入采样数据
        if (sampleBits === 8) {
          for (let i = 0; i < bytes.length; i++, offset++) {
            const s = Math.max(-1, Math.min(1, bytes[i]));
            let val = s < 0 ? s * 0x8000 : s * 0x7fff;
            val = Math.floor(255 / (65535 / (val + 32768)));
            data.setInt8(offset, val);
          }
        } else {
          for (let i = 0; i < bytes.length; i++, offset += 2) {
            const s = Math.max(-1, Math.min(1, bytes[i]));
            data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
          }
        }

        return new Blob([data], { type: 'audio/wav' });
      },
    };

    // 音频采集
    this.recorder.addEventListener('audioprocess', (e) => {
      this.audioData.input(e.inputBuffer.getChannelData(0));
    });
  }

  // 开始录音
  start() {
    this.audioInput.connect(this.recorder);
    this.recorder.connect(this.context.destination);
  }

  // 停止
  stop() {
    this.recorder.disconnect();
  }

  // 结束
  end() {
    this.context.close();
  }

  // 继续
  again() {
    this.recorder.connect(this.context.destination);
  }

  // 获取音频文件
  getBlob() {
    this.stop();
    return this.audioData.encodeWAV();
  }

  // 回放
  play(audio: HTMLAudioElement) {
    audio.src = window.URL.createObjectURL(this.getBlob());
  }

  // 上传
  upload(
    url: string,
    callback: (
      status: string,
      e: ProgressEvent<XMLHttpRequestEventTarget>
    ) => void
  ) {
    const fd = new FormData();
    fd.append('audioData', this.getBlob());
    const xhr = new XMLHttpRequest();
    if (callback) {
      xhr.upload.addEventListener(
        'progress',
        function (e) {
          callback('uploading', e);
        },
        false
      );
      xhr.addEventListener(
        'load',
        function (e) {
          callback('ok', e);
        },
        false
      );
      xhr.addEventListener(
        'error',
        function (e) {
          callback('error', e);
        },
        false
      );
      xhr.addEventListener(
        'abort',
        function (e) {
          callback('cancel', e);
        },
        false
      );
    }
    xhr.open('POST', url);
    xhr.send(fd);
  }
}
