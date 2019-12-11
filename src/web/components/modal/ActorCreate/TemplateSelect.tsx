import React, { useState } from 'react';
import { Input, Empty, Row, Col } from 'antd';
import { connect, DispatchProp } from 'react-redux';
import { findTemplate } from '@src/shared/redux/actions/actor';
import { List } from 'immutable';
import TemplateItem from '../../TemplateItem';
import styled from 'styled-components';
import { ActorTemplateStateType, ActorTemplateType } from '@redux/types/actor';

const Search = Input.Search;

const Body = styled.div`
  margin-top: 20px;
`;

type SelectTemplateCallback = (template: ActorTemplateType) => void;

/**
 * 渲染模板列表
 * 一行三列
 */
const TemplateList = (props: {
  list: List<ActorTemplateStateType>;
  onSelectTemplate: SelectTemplateCallback;
}) => {
  return (
    <Row gutter={8}>
      {props.list.map((item, index) => {
        return (
          <Col key={'template-suggest-result' + item.get('uuid')} xs={8}>
            <TemplateItem
              canEdit={false}
              name={item.get('name')}
              desc={item.get('desc')}
              // TODO
              // creator={item.get('creator_name') || '未知'}
              creator={'未知'}
              time={item.get('updatedAt')}
              onCreate={() => props.onSelectTemplate(item.toJS())}
            />
          </Col>
        );
      })}
    </Row>
  );
};

interface Props extends DispatchProp<any> {
  findingResult: List<ActorTemplateStateType>;
  suggestTemplate: List<ActorTemplateStateType>;
  onSelectTemplate: SelectTemplateCallback;
}
/**
 * 选择模板
 */
const TemplateSelect = (props: Props) => {
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

    return props.findingResult.size === 0 ? (
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
  return (
    <div>
      <Search
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="搜索模板"
        onSearch={handleSearch}
        enterButton
      />

      <Body>{renderList()}</Body>
    </div>
  );
};

export default connect((state: any) => ({
  suggestTemplate: state.getIn(['actor', 'suggestTemplate']),
  findingResult: state.getIn(['actor', 'findingResult']),
}))(TemplateSelect);
