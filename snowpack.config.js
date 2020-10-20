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

module.exports = {
  // extends: '@snowpack/app-scripts-react',
  install: [
    'antd/dist/antd.dark.css'
  ],
  exclude: [
    '**/node_modules/**/*',
    '**/__tests__/*',
    '**/*.@(spec|test).@(js|mjs)',
    '**/src/app/**/*',
    '**/src/appv2/**/*',
    '**/src/portal/**/*',
    '**/src/playground/**/*',
  ],
  mount: {
    public: '/',
    src: '/_dist_',
  },
  scripts: {
    'mount:font': 'mount src/web/assets/fonts --to /fonts',
    'mount:font2': 'mount src/web/assets/fonts --to /main/fonts',
  },
  alias: {
    ...tsAlias,
    '@src': './src/',
  },
  plugins: [
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
            from: `const resBundle = require("i18next-resource-store-loader!./langs/index.js");`,
            to: 'import resBundle from "./langs/zh-CN/translation.json"',
          },
          {
            from: `export const resources = resBundle;`,
            to: 'export const resources = {"zh-CN": {translation: resBundle}};',
          },
          {
            from: 'import Config from "config";',
            to: `const Config = ${JSON.stringify({
              sentry: require('config').get('sentry'),
            })};`,
          },

          // 这里是临时解决方案
          // https://github.com/snowpackjs/snowpack/discussions/1360
          {
            from: 'import "antd/dist/antd.dark.less";',
            to: 'import "antd/dist/antd.dark.css";',
          },
        ],
      },
    ],
  ],
  installOptions: {
    rollup: {
      context: 'window',
    },
  },
  devOptions: {
    open: 'none',
    port: 8089,
    out: '.snowpack',
    output: 'stream'
  },
};
