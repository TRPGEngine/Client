import axios from 'axios';
import { fileUrl } from '../../api/trpg.api';
const uploadPicHost = 'https://sm.ms/api/upload';

// https://sm.ms/api/upload
export const toNetwork = function(userUUID, file) {
  let form = new FormData();
  form.append('smfile', file);
  form.append('ssl', true);
  form.append('format', 'json');
  return axios({
    url: uploadPicHost,
    method: 'post',
    data: form,
  })
    .then((res) => {
      let data = res.data;
      if (data.code === 'success') {
        return axios
          .post(fileUrl + '/chatimg/smms', data.data, {
            headers: { 'user-uuid': userUUID },
          })
          .then((res) => res.data);
      } else {
        console.error(data);
        return false;
      }
    })
    .catch((err) => {
      console.error(err, err.request, err.config);
      return false;
    });
};
