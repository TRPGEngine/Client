const rnStorage = require('../api/rnStorage.api.js');

window.onOAuthFinished = async function(uuid, token) {
  if(!uuid || !token) {
    console.error('oauth登录失败, 缺少必要参数');
    return;
  }

  // 注册新的uuid与token并刷新
  await rnStorage.set('uuid', uuid);
  await rnStorage.set('token', token);

  window.location.reload();
}
