const tsconfig = require('./tsconfig.json');
const _ = require('lodash');
const path = require('path');

const pathMap = tsconfig.compilerOptions.paths;
const tspathMountMapping = _.mapValues(pathMap, (val, key) => {
  const target = val[0];
  const mountedPath = path.relative('./src', target);

  return mountedPath.replace(`${path.sep}*`, '').replace(`${path.sep}`, '/');
});

const tsAlias = _(tspathMountMapping)
  .mapValues((value) => `./src/${value}`)
  .mapKeys((value, key) => key.replace(/\/\*$/, ''))
  .value();

// const scriptsPathsMapping = _.fromPairs(
//   _.toPairs(tspathMountMapping)
//     .map(([key, val]) => {
//       if (/^[a-zA-Z]/.test(val)) {
//         return [
//           `mount:tspath:${key}`,
//           `mount ${key.replace(`/*`, '')} --to /_dist_/${val}`,
//         ];
//       }
//     })
//     .filter(_.isArray)
// );

// ant design 相关
// Copy from Client/build/config/webpack.base.config.js
const modifyVars = _.toPairs({
  'primary-color': '#8C6244',
  'error-color': '#e44a4c',
  'text-selection-bg': '#1890ff',
})
  .map(([key, value]) => `--modify-var="${key}=${value}"`)
  .join(' ');
const antdLessCompile = `${path.resolve(
  __dirname,
  './node_modules/.bin/lessc'
)} ${path.resolve(
  __dirname,
  './node_modules/antd/dist/antd.less'
)} ${path.resolve(
  __dirname,
  './public/.snowpack/antd.css'
)} --js ${modifyVars}`;
const antdDarkLessCompile = `${path.resolve(
  __dirname,
  './node_modules/.bin/lessc'
)} ${path.resolve(
  __dirname,
  './node_modules/antd/dist/antd.dark.less'
)} ${path.resolve(
  __dirname,
  './public/.snowpack/antd.dark.css'
)} --js ${modifyVars}`;

module.exports = {
  exclude: [
    '**/node_modules/**/*',
    '**/__tests__/*',
    '**/*.@(spec|test).@(js|mjs)',
    '**/src/app/**/*',
    '**/src/appv2/**/*',
    '**/src/mini-program/**/*',
    '**/src/portal/**/*',
    '**/src/playground/**/*',
    '**/src/plugins/**/*',
  ],
  mount: {
    public: '/',
    dist: '/',
    src: '/_dist_',
  },
  routes: [
    { match: 'routes', src: '.*', dest: '/index.html' },
    { src: '/favicon.ico', dest: '/_dist_/web/assets/img/favicon.ico' },
  ],
  alias: {
    ...tsAlias,
    '@src': './src/',
  },
  plugins: [
    [
      '@snowpack/plugin-run-script',
      { name: 'antd compile', cmd: antdLessCompile },
    ],
    [
      '@snowpack/plugin-run-script',
      { name: 'antd dark mode compile', cmd: antdDarkLessCompile },
    ],
    '@snowpack/plugin-typescript',
    '@snowpack/plugin-sass',
    'snowpack-plugin-less',
    // '@snowpack/plugin-react-refresh',
    [
      'snowpack-plugin-replace',
      {
        list: [
          {
            from: /process\.env/g,
            to: 'import.meta.env',
          },
          {
            from: `require("../../package.json").version`,
            to: '"0.0.0"',
          },
          {
            from: 'import Config from "config";',
            to: `const Config = ${JSON.stringify(
              require('./build/config/configObj')
            )};`,
          },
          {
            from: 'import "antd/dist/antd.dark.less";',
            to: 'import "/.snowpack/antd.dark.css"',
          },
          {
            file: require.resolve('./src/web/assets/css/iconfont.css'),
            from: /\.\.\/fonts\/iconfont/g,
            to: '/_dist_/web/assets/fonts/iconfont',
          },
        ],
      },
    ],
  ],
  packageOptions: {
    rollup: {
      context: 'window',
    },
  },
  devOptions: {
    open: 'none',
    port: 8089,
    out: '.snowpack',
    output: 'stream',
    hmrErrorOverlay: false,
  },
};
