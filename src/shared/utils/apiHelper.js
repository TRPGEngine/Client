const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();

exports.getTemplate = function(template_uuid, cb) {
  if(!template_uuid) {
    console.error('have not template_uuid:', template_uuid);
    return;
  }
  api.emit('actor::getTemplate', {uuid: template_uuid}, function(data) {
    if(data.result) {
      cb(data.template);
    }else {
      console.error(data.msg);
    }
  })
}
