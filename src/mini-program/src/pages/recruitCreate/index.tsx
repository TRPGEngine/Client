import React, { useCallback, useState } from 'react';
import { View, Text } from '@tarojs/components';
import {
  createRecruit,
  RecruitContactType,
  recruitContactTypeMap,
  RecruitPlatform,
  recruitPlatformMap,
} from '@shared/model/trpg';
import _isNil from 'lodash/isNil';
import Taro from '@tarojs/taro';
import { AtButton, AtForm, AtInput, AtRadio, AtTextarea } from 'taro-ui';
import _toPairs from 'lodash/toPairs';
import { useTaroAuthCheck } from '../../hooks/useTaroAuthCheck';

import './index.less';

const Page: React.FC = () => {
  useTaroAuthCheck();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState<RecruitPlatform>('trpgengine');
  const [contactType, setContactType] = useState<RecruitContactType>('group');
  const [contactContent, setContactContent] = useState('');

  const [loading, setLoading] = useState(false);
  const handleCreateRecruit = useCallback(() => {
    setLoading(true);

    createRecruit(title, content, platform, contactType, contactContent)
      .then(() => {
        Taro.showToast({
          title: '创建成功',
          mask: true,
        });
        setTimeout(() => {
          Taro.navigateBack();
        }, 1000);
      })
      .catch((e) => {
        Taro.showToast({
          title: '创建失败:' + String(e),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [title, content, platform, contactType, contactContent]);

  return (
    <View className="root">
      <AtForm>
        <AtInput
          name="title"
          title="标题"
          type="text"
          placeholder="请输入标题"
          value={title}
          onChange={(v) => setTitle(String(v))}
        />

        <AtTextarea
          value={content}
          onChange={(v) => setContent(v)}
          maxLength={2000}
          placeholder="请输入您的招募信息"
        />

        <AtRadio
          options={_toPairs(recruitPlatformMap).map(([value, text]) => ({
            label: text,
            value,
          }))}
          value={platform}
          onClick={(v) => setPlatform(v)}
        />

        <View className="form-group-text">
          <Text>联系方式</Text>
        </View>

        <AtRadio
          options={_toPairs(recruitContactTypeMap).map(([value, text]) => ({
            label: text,
            value,
          }))}
          value={contactType}
          onClick={(v) => setContactType(v)}
        />
        <AtInput
          name="contactContent"
          title="联系方式"
          type="text"
          placeholder="这是用户联系到你的唯一方式"
          value={contactContent}
          onChange={(v) => setContactContent(String(v))}
        />

        <AtButton loading={loading} onClick={handleCreateRecruit}>
          提交
        </AtButton>
      </AtForm>
    </View>
  );
};

export default Page;
