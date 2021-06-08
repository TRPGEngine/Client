const path = require('path');
const fs = require('fs');

/**
 * Get plugin dir names
 */
function getPluginDirs() {
  const pluginsDir = path.resolve(__dirname, '../../src/plugins/');

  const list = fs.readdirSync(pluginsDir);

  const plugins = list.filter((item) =>
    fs.statSync(path.resolve(pluginsDir, item)).isDirectory()
  );

  return plugins;
}

exports.getPluginDirs = getPluginDirs;
