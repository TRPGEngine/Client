import Storage from 'react-native-storage';
const config = require('../../config/project.config');

let storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  size: 1000,

  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: config.platform==='app' ? require('react-native').AsyncStorage : localStorage,

  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: 1000 * 3600 * 24,

  // 读写时在内存中缓存数据。默认启用。
  enableCache: true,

  // 如果storage中没有相应数据，或数据已过期，
  // 则会调用相应的sync方法，无缝返回最新数据。
  // sync方法的具体说明会在后文提到
  // 你可以在构造函数这里就写好sync的方法
  // 或是在任何时候，直接对storage.sync进行赋值修改
  // 或是写到另一个文件里，这里require引入
  // sync: require('你可以另外写一个文件专门处理sync')
})

module.exports = {
  set: async (key, data) => {
    try {
      if(!!key && !!data) {
        await storage.save({key, data});
      }else if(!!key && typeof key === 'object' && !data) {
        for (var subKey in key) {
          if (key.hasOwnProperty(subKey)) {
            await storage.save({
              key: subKey,
              data: key[subKey]
            });
          }
        }
      }
    }catch(e) {
      console.error(e);
    }

    return this;
  },
  get: async (key) => {
    let res;
    try {
      res = await storage.load({
        key,
        autoSync: true,
        syncInBackground: false,
      });
    }catch(e) {
      res = '';
    }
    return res;
  },
  remove: async (key) => {
    await storage.remove({key});
    return this;
  }
};
