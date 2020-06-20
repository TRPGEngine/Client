const execa = require('execa');
const path = require('path');
const inquirer = require('inquirer');
const rootPath = path.resolve(__dirname, '../../');
const packageConfig = require('../../package.json');
const version = packageConfig.version; // app版本号
const appVersion = packageConfig.appVersion; // app版本号

if (require.main === module) {
  const filepath = path.resolve(rootPath, './node_modules/.bin/code-push');

  console.log('===================================');
  console.log('====请确认: 在配置中的app版本号升级了么?');
  console.log('===================================');

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'deploymentName',
        message: '发布阶段',
        choices: ['Staging', 'Production'],
        default: 'Staging',
      },
      {
        type: 'list',
        name: 'platform',
        message: '发布平台',
        choices: ['android', 'ios'],
        default: 'android',
      },
      {
        type: 'editor',
        name: 'desc',
        message: '更新描述',
        default: `版本更新 v${version}\n===========\n\n`,
      },
      {
        type: 'checkbox',
        name: 'ext',
        message: '额外配置',
        choices: ['mandatory'],
      },
    ])
    .then((answers) => {
      const { deploymentName, platform, desc, ext } = answers;

      console.log(`Uploading App Version: ${appVersion}`);
      console.log(`Uploading JS Version: ${version}`);
      console.log(`Code Push: ${filepath}`);

      const args = [
        'release-react',
        'TRPGEngine',
        platform,
        '--targetBinaryVersion',
        appVersion, // 可以为范围。目前先弄具体的
        '--deploymentName',
        deploymentName,
        '--description',
        desc,
        ...ext.map((s) => `--${s}`),
      ];

      console.log('发布参数:', args.join(' '));
      return inquirer
        .prompt([{ type: 'confirm', name: 'confirm', message: '确认参数?' }])
        .then((an) => {
          if (an.confirm === true) {
            return args;
          } else {
            throw new Error('User Cancel');
          }
        });
    })
    .then((args) => {
      console.log('=============================');
      const env = {
        PLATFORM: 'app',
        NODE_ENV: 'production',
        REACT_NATIVE_APP_ROOT: '../../', // TODO: 需要想办法收起来
      };
      console.log('args', args);
      console.log('env', env);
      execa(filepath, args, {
        cwd: rootPath,
        env,
      }).all.pipe(process.stdout);
    });
}
