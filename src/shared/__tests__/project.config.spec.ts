import config from '@shared/project.config';

describe('project.config', () => {
  test('check props', () => {
    expect(config).toHaveProperty(
      'version',
      expect.stringMatching('d*?.d*?.d*?')
    );
    expect(config).toHaveProperty('environment', expect.any(String));
    expect(config).toHaveProperty('platform', expect.any(String));
    expect(config).toHaveProperty('isSSL', expect.any(Boolean));
    expect(config).toHaveProperty('io', {
      protocol: expect.stringMatching(/wss|ws/),
      host: expect.any(String),
      port: expect.any(String),
    });
    expect(config).toHaveProperty('chat', {
      maxLength: expect.any(Number),
      isWriting: {
        throttle: expect.any(Number),
        timeout: expect.any(Number),
      },
    });
    expect(config).toHaveProperty('file', {
      protocol: expect.stringMatching(/https?/),
      host: expect.any(String),
      port: expect.any(String),
      url: expect.any(String),
      getFileImage: expect.any(Function),
      getAbsolutePath: expect.any(Function),
      getRelativePath: expect.any(Function),
      getUploadsImagePath: expect.any(Function),
    });
    expect(config).toHaveProperty('defaultImg', {
      user: expect.any(String),
      getUser: expect.any(Function),
      group: expect.any(String),
      robot: expect.any(String),
      getGroup: expect.any(Function),
      trpgsystem: expect.any(String),
      actor: expect.any(String),
      chatimg_fail: expect.any(String),
      file: {
        default: expect.any(String),
        pdf: expect.any(String),
        excel: expect.any(String),
        ppt: expect.any(String),
        word: expect.any(String),
        txt: expect.any(String),
        pic: expect.any(String),
      },
      color: expect.any(Array),
    });
    expect(config).toHaveProperty('github', {
      projectUrl: expect.any(String),
      projectPackageUrl: expect.any(String),
      projectAppPackageUrl: expect.any(String),
    });
    expect(config).toHaveProperty('url', {
      api: expect.any(String),
      rtc: expect.any(String),
      homepage: expect.any(String),
      docs: expect.any(String),
      goddessfantasy: expect.any(String),
      loginUrl: expect.any(String),
      blog: expect.any(String),
      versionBlog: expect.any(String),
      portal: expect.any(String),
      rsshub: expect.any(String),
      getInviteUrl: expect.any(Function),
      rssNews: expect.any(Array),
    });
    expect(config).toHaveProperty('defaultSettings', {
      user: {
        favoriteDice: expect.any(Array),
        msgStyleType: expect.any(String),
        msgStyleCombine: expect.any(Boolean),
        msgInputHistorySwitch: expect.any(Boolean),
      },
      system: {
        notification: expect.any(Boolean),
        disableSendWritingState: expect.any(Boolean),
        showSelfInWritingState: expect.any(Boolean),
        chatBoxType: expect.any(String),
        audioConstraints: {
          autoGainControl: expect.any(Boolean),
          echoCancellation: expect.any(Boolean),
          noiseSuppression: expect.any(Boolean),
        },
      },
    });
  });

  describe('check environment variable', () => {
    const oldEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...oldEnv };
      delete process.env.NODE_ENV;
    });

    afterEach(() => {
      process.env = oldEnv;
    });

    test.each([
      [
        'default test',
        {},
        {
          environment: 'development',
          io: {
            host: 'localhost',
            port: '23256',
            protocol: 'ws',
          },
          url: {
            rtc: 'wss://rtc.moonrailgun.com:4443',
            portal: 'https://trpg.moonrailgun.com/portal',
          },
        },
      ],
      [
        'default production',
        {
          NODE_ENV: 'production',
        },
        {
          environment: 'production',
          io: {
            host: 'trpgapi.moonrailgun.com',
            port: '80',
          },
        },
      ],
      [
        'test trpg host',
        {
          NODE_ENV: 'production',
          TRPG_HOST: '123.45.68.90:45632',
        },
        {
          environment: 'production',
          io: {
            host: '123.45.68.90',
            port: '45632',
          },
        },
      ],
      [
        'test rtc server',
        {
          RTC_HOST: 'wss://192.168.1.101:4443',
        },
        {
          url: {
            rtc: 'wss://192.168.1.101:4443',
          },
        },
      ],
      [
        'test portal url',
        {
          TRPG_PORTAL: 'http://127.0.0.1:1234/portal',
        },
        {
          url: {
            portal: 'http://127.0.0.1:1234/portal',
          },
        },
      ],
    ])('%s', (name: string, env: any, obj: any) => {
      process.env = {
        ...process.env,
        ...env,
      };

      const testConfig = require('@shared/project.config').default;

      expect(testConfig).toMatchObject(obj);
    });
  });
});
