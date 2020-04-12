// https://github.com/dependents/node-dependency-tree

const dependencyTree = require('dependency-tree');
const path = require('path');
const fs = require('fs-extra');

const ROOT_DIR = path.resolve(__dirname, '../../');

// Returns a dependency tree object for the given file
const tree = dependencyTree({
  // filename: path.resolve(ROOT_DIR, 'index.js'),
  filename: path.resolve(ROOT_DIR, 'src/App.tsx'),
  directory: ROOT_DIR,
  tsConfig: path.resolve(ROOT_DIR, 'tsconfig.json'),
  nodeModulesConfig: {
    entry: 'module',
  },
  // filter: (path) => path.indexOf('node_modules') === -1, // optional
  nonExistent: [], // optional
});

const target = path.resolve(__dirname, './.deps');
fs.writeFileSync(target, JSON.stringify(tree, null, 4));

console.log('依赖解析文件生成完毕...', target);
