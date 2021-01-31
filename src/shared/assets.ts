import failedImg from '@web/assets/img/img_fail.png';
import robotImg from '@web/assets/img/robot_dark.svg';

/**
 * 获取默认图片
 */
export function getDefaultImage({ fileUrl }: { fileUrl: string }) {
  return {
    user: '/src/assets/img/gugugu1.png',
    /**
     * @deprecated 使用Avatar组件生成默认头像
     */
    getUser(name: string) {
      if (name) {
        return `${fileUrl}/file/avatar/svg?name=${name}`;
      } else {
        return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 一像素透明图片
      }
    },
    group: '/src/web/assets/img/gugugu1.png',
    /**
     * @deprecated 使用Avatar组件生成默认头像
     */
    getGroup(name: string) {
      // 同getUser
      if (name) {
        return `${fileUrl}/file/avatar/svg?name=${name}`;
      } else {
        return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 一像素透明图片
      }
    },
    trpgsystem: '/src/web/assets/img/system_notice.png',
    robot: robotImg,
    actor: '',
    chatimg_fail: failedImg,
    file: {
      default: '/src/web/assets/img/file/default.png',
      pdf: '/src/web/assets/img/file/pdf.png',
      excel: '/src/web/assets/img/file/excel.png',
      ppt: '/src/web/assets/img/file/ppt.png',
      word: '/src/web/assets/img/file/word.png',
      txt: '/src/web/assets/img/file/txt.png',
      pic: '/src/web/assets/img/file/pic.png',
    },
  };
}
