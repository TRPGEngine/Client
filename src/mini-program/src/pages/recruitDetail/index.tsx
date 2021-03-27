import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, RichText } from '@tarojs/components';
import { fetchUserRecruitDetail, RecruitItemType } from '@shared/model/trpg';
import _isNil from 'lodash/isNil';
import { getFromNow } from '@shared/utils/date-helper';
import Taro, { useRouter } from '@tarojs/taro';
import { AtActivityIndicator, AtButton, AtDivider, AtTag } from 'taro-ui';

import './index.less';

const Page: React.FC = () => {
  const { params } = useRouter();
  const { recruitUUID } = params;
  const [recruitDetail, setRecruitDetail] = useState<RecruitItemType>();
  useEffect(() => {
    if (typeof recruitUUID === 'string') {
      fetchUserRecruitDetail(recruitUUID).then(setRecruitDetail);
    }
  }, [recruitUUID]);

  const handleJoin = useCallback(() => {
    if (_isNil(recruitDetail)) {
      return;
    }

    const { platform, contact_type, contact_content } = recruitDetail;

    let msg = '';

    if (platform === 'qq') {
      if (contact_type === 'group') {
        // qq群
        msg += '添加如下 QQ群 ';
      } else if (contact_type === 'user') {
        msg += '添加如下 QQ用户 ';
      }
    } else {
      msg += '添加如下 TRPG Engine链接 ';
    }

    msg += '以联系到主持人, 点击确认以复制到剪切板:\n';
    msg += contact_content;

    Taro.showModal({
      title: '请求加入',
      content: msg,
      showCancel: false,
      success: () => {
        Taro.setClipboardData({
          data: contact_content,
        });
      },
    });
  }, [recruitDetail]);

  if (_isNil(recruitDetail)) {
    return <AtActivityIndicator mode="center"></AtActivityIndicator>;
  }

  return (
    <View className="root">
      <View className="title">
        <Text>{recruitDetail.title}</Text>
        <AtTag type="primary" circle>
          {recruitDetail.platform}
        </AtTag>
      </View>
      <View className="author">
        <View>{getFromNow(recruitDetail.updatedAt)}</View>
        <View>by {recruitDetail.author}</View>
      </View>

      <AtDivider />

      <View className="content">
        <RichText nodes={recruitDetail.content} />
      </View>

      {recruitDetail.completed === true ? (
        <AtButton disabled>招募已完成</AtButton>
      ) : (
        <AtButton type="primary" onClick={handleJoin}>
          请求加入
        </AtButton>
      )}
    </View>
  );
};

export default Page;
