import React, { useState, useCallback } from 'react';
import { Input, Empty, Row, Col, Button } from 'antd';
import { connect, useDispatch } from 'react-redux';
import { findTemplate } from '@src/shared/redux/actions/actor';
import TemplateItem from '../../TemplateItem';
import styled from 'styled-components';
import { ActorTemplateType } from '@redux/types/actor';
import { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';
import { TMemo } from '@shared/components/TMemo';
import { showModal, hideModal } from '@redux/actions/ui';
import { SharedActorList } from './SharedActorList';

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
          <p>推荐模板</p>
          <TemplateList
            list={props.suggestTemplate}
            onSelectTemplate={props.onSelectTemplate}
          />
        </div>
      );
    }

    return props.findingResult.length === 0 ? (
      <Empty description="暂未搜索结果" />
    ) : (
      <div>
        <p>搜索结果</p>
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
    dispatch(showModal(<SharedActorList />));
  }, []);

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Button type="primary" onClick={handleShowSharedActorList}>
          从人物库中创建
        </Button>
        <Search
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索模板"
          onSearch={handleSearch}
          enterButton
        />
      </div>

      <Body>{renderList()}</Body>
    </div>
  );
});
TemplateSelect.displayName = 'TemplateSelect';

export default connect((state: TRPGState) => ({
  suggestTemplate: state.actor.suggestTemplate,
  findingResult: state.actor.findingResult,
}))(TemplateSelect);
