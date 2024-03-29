import React, { useState, useCallback } from 'react';
import { Input, Empty, Row, Col, Button, Typography } from 'antd';
import { connect, useDispatch } from 'react-redux';
import { findTemplate } from '../../../redux/actions/actor';
import TemplateItem from '@capital/web/components/TemplateItem';
import styled from 'styled-components';
import type { ActorTemplateType } from '../../../redux/types/actor';
import type {
  TRPGState,
  TRPGDispatchProp,
} from '@capital/shared/redux/types/__all__';
import { TMemo } from '@capital/shared/components/TMemo';
import { hideModal } from '@capital/shared/redux/actions/ui';
import { SharedActorList } from './SharedActorList';
import { t } from '@capital/shared/i18n';
import { openModal } from '@capital/web/components/Modal';

const Search = Input.Search;

const Body = styled.div`
  margin-top: 20px;
`;

type SelectTemplateCallback = (template: ActorTemplateType) => void;

/**
 * 渲染模板列表
 * 一行三列
 */
const TemplateList = TMemo(
  (props: {
    list: ActorTemplateType[];
    onSelectTemplate: SelectTemplateCallback;
  }) => {
    return (
      <Row gutter={8}>
        {props.list.map((item, index) => {
          return (
            <Col key={'template-suggest-result' + item.uuid} xs={8}>
              <TemplateItem
                canEdit={false}
                name={item.name}
                desc={item.desc}
                // TODO
                // creator={item.get('creator_name') || '未知'}
                creator={'未知'}
                time={item.updatedAt}
                onCreate={() => props.onSelectTemplate(item)}
              />
            </Col>
          );
        })}
      </Row>
    );
  }
);
TemplateList.displayName = 'TemplateList';

interface Props extends TRPGDispatchProp {
  findingResult: ActorTemplateType[];
  suggestTemplate: ActorTemplateType[];
  onSelectTemplate: SelectTemplateCallback;
}
/**
 * 选择模板
 */
const TemplateSelect: React.FC<Props> = TMemo((props: Props) => {
  const dispatch = useDispatch();

  const renderList = () => {
    if (search === '') {
      return (
        <div>
          <p>{t('推荐模板')}</p>
          <TemplateList
            list={props.suggestTemplate}
            onSelectTemplate={props.onSelectTemplate}
          />
        </div>
      );
    }

    return props.findingResult.length === 0 ? (
      <Empty description={t('暂未搜索结果')} />
    ) : (
      <div>
        <p>{t('搜索结果')}</p>
        <TemplateList
          list={props.findingResult}
          onSelectTemplate={props.onSelectTemplate}
        />
      </div>
    );
  };

  const [search, setSearch] = useState('');
  const handleSearch = (name: string) => props.dispatch(findTemplate(name));
  const handleShowSharedActorList = useCallback(() => {
    dispatch(hideModal()); // 关闭掉当前的模态框
    openModal(<SharedActorList />);
  }, []);

  return (
    <div>
      <Typography.Title level={5}>{t('从现有模板中创建')}</Typography.Title>
      <Search
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t('搜索模板')}
        onSearch={handleSearch}
        enterButton={true}
      />
      <Body>{renderList()}</Body>
      <Body>
        <Typography.Title level={5}>
          {t('或以现有人物卡为模板创建')}
        </Typography.Title>
        <Button
          type="primary"
          onClick={handleShowSharedActorList}
          style={{ width: '100%' }}
        >
          {t('从人物库中选择')}
        </Button>
      </Body>
    </div>
  );
});
TemplateSelect.displayName = 'TemplateSelect';

export default connect((state: TRPGState) => ({
  suggestTemplate: state.actor.suggestTemplate,
  findingResult: state.actor.findingResult,
}))(TemplateSelect);
