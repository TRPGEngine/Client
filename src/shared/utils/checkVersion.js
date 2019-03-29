const axios = require('axios');
const config = require('../../../config/project.config.js');

function checkVersion(cb) {
  console.log('正在检查版本...');
  axios
    .get(config.github.projectPackageUrl)
    .then(function(response) {
      let netPackage = response.data;
      let netVersion = netPackage.version;
      cb(netVersion === config.version);
    })
    .catch(function(err) {
      console.log('网络错误\n' + err);
    });
}

module.exports = checkVersion;
