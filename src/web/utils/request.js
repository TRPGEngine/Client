import axios from 'axios';

export function request(...args) {
  return axios(...args).catch((err) => {
    import('./sentry').then((module) => module.error(err));
    throw err;
  });
}
