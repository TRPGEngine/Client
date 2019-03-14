import * as Sentry from '@sentry/browser';
import config from 'config';
import _ from 'lodash';

Sentry.init({
  dsn: _.get(config, 'sentry.dsn'),
});

export function error(err) {
  Sentry.captureException(err);
}
