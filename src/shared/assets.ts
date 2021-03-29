import failedImg from '@web/assets/img/img_fail.png';
import robotImg from '@web/assets/img/robot_dark.svg';
import systemNoticeImg from '@web/assets/img/system_notice.png';

import guguguImg from '@web/assets/img/gugugu1.png';

import fileDefaultImg from '@web/assets/img/file/default.png';
import filePdfImg from '@web/assets/img/file/pdf.png';
import fileExcelImg from '@web/assets/img/file/excel.png';
import filePptImg from '@web/assets/img/file/ppt.png';
import fileWordImg from '@web/assets/img/file/word.png';
import fileTxtImg from '@web/assets/img/file/txt.png';
import filePicImg from '@web/assets/img/file/pic.png';

/**
 * 获取默认图片
 */
export function getDefaultImage({ fileUrl }: { fileUrl: string }) {
  return {
    user: guguguImg,
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
    group: guguguImg,
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
    trpgsystem: systemNoticeImg,
    robot: robotImg,
    actor: '',
    chatimg_fail: failedImg,
    file: {
      default: fileDefaultImg,
      pdf: filePdfImg,
      excel: fileExcelImg,
      ppt: filePptImg,
      word: fileWordImg,
      txt: fileTxtImg,
      pic: filePicImg,
    },
  };
}
