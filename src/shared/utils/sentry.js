const config = require('../../../config/project.config.js');

export function error(err) {
  if (config.platform === 'web') {
    import('../../web/utils/sentry').then((module) => module.error(err));
  }
}
