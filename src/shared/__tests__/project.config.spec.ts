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
      homepage: expect.any(String),
      goddessfantasy: expect.any(String),
      blog: expect.any(String),
      portal: expect.any(String),
    });
    expect(config).toHaveProperty('defaultSettings', {
      user: {
        favoriteDice: expect.any(Array),
      },
      system: {
        notification: expect.any(Boolean),
        disableSendWritingState: expect.any(Boolean),
        showSelfInWritingState: expect.any(Boolean),
      },
    });
  });
});
