import * as Sentry from '@sentry/browser';
import config from 'config';
import _ from 'lodash';

Sentry.init({
  dsn: _.get(config, 'sentry.dsn'),
});

export function error(err) {
  let fn;
  if (typeof err === 'string') {
    fn = Sentry.captureMessage.bind(Sentry);
  } else {
    fn = Sentry.captureException.bind(Sentry);
  }
  const sentryId = fn(err);
  console.warn('error: sentryId', sentryId);
}
