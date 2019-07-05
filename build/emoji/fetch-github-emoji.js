const path = require('path');
const axios = require('axios');
const fs = require('fs-extra');

fs.ensureDir(path.resolve(__dirname, './emoji'));

function fetchEmojiAndSave(name, url) {
  return axios
    .get(url, {
      responseType: 'arraybuffer',
    })
    .then((res) => {
      const data = res.data;
      console.log('保存表情:', name);
      return fs.outputFile(
        path.resolve(__dirname, `./emoji/${name}.png`),
        data
      );
    })
    .catch((err) => {
      const item = { name, url };
      console.error('保存失败:', item);

      errorList.push(item);
    });
}

const errorList = [];

axios
  .get('https://api.github.com/emojis')
  .then((res) => {
    const data = res.data;

    const list = [];
    for (const name in data) {
      if (data.hasOwnProperty(name)) {
        const url = data[name];

        list.push(fetchEmojiAndSave(name, url));
      }
    }

    return Promise.all(list);
  })
  .then((list) => {
    console.log(`保存完毕, 共${list.length}个文件, 失败${errorList.length}个`);

    fs.outputJson(path.resolve(__dirname, 'errorList.json'), errorList);
  });
