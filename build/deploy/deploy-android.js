const execa = require('execa');
const path = require('path');
const rootPath = path.resolve(__dirname, '../../');
const packageConfig = require('../../package.json');
const version = packageConfig.version;

if (require.main === module) {
  console.log(`Uploading Version: ${version}`);
  const filepath = path.resolve(rootPath, './node_modules/.bin/code-push');
  console.log(`Code Push: ${filepath}`);
  const arguments = `release TRPGEngine ./dist/index.android.bundle ${version} --d Production`;
  console.log(`Arguments: ${arguments}`);
  console.log('=============================');
  execa(filepath, arguments.split(' '), {
    cwd: rootPath,
  }).all.pipe(process.stdout);
}
