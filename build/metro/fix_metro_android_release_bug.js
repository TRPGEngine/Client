// fix_metro_android_release_bug.js
// Temporary fix for this issue: https://github.com/facebook/metro/pull/420
// Issue: https://github.com/facebook/react-native/issues/25325
const fs = require('fs');
const path = require('path');

const fileLocation = path.resolve(
  __dirname,
  '../../node_modules/metro/src/DeltaBundler/Serializers/getAssets.js'
);
const targetText = 'getJsOutput(module).type === "js/module/asset"';
const replacementText =
  "getJsOutput(module).type === 'js/module/asset' && path.relative(options.projectRoot, module.path) !== 'package.json'";

const fileContent = fs.readFileSync(fileLocation, 'utf8');
if (
  fileContent.includes(targetText) &&
  !fileContent.includes(replacementText)
) {
  const patchedFileContent = fileContent.replace(targetText, replacementText);
  fs.writeFileSync(fileLocation, patchedFileContent, 'utf8');
}
