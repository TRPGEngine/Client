import axios from 'axios';
import config from '@src/shared/project.config';

export const request = axios.create({
  baseURL: config.url.api,
  headers: {
    token: window.localStorage.getItem('jwt'),
  },
});
