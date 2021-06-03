import React from 'react';
import BaseCard from './BaseCard';
import _get from 'lodash/get';
import TLoadable from '@web/components/TLoadable';

const AudioPlayer = TLoadable(() => import('./media/AudioPlayer'));

type AllowedMediaType = 'audio' | 'video';
type AllowedMediaSource = 'bilibili' | 'netease';

/**
 * 多媒体卡片
 * 包括音乐与视频
 */

export class Media extends BaseCard {
  /**
   * 多媒体类型
   */
  get mediaType(): AllowedMediaType | undefined {
    return _get(this.props.info, ['data', 'mediaType']);
  }

  /**
   * 多媒体来源
   * 比如bilibili, 网易云音乐
   */
  get mediaSource(): AllowedMediaSource | undefined {
    return _get(this.props.info, ['data', 'mediaSource']);
  }

  get mediaUrl(): string {
    return _get(this.props.info, ['data', 'mediaUrl']);
  }

  getCardView() {
    if (this.mediaType === 'audio') {
      return (
        <div style={{ minWidth: 220 }}>
          <AudioPlayer url={this.mediaUrl} />
        </div>
      );
    }

    return null;
  }
}
