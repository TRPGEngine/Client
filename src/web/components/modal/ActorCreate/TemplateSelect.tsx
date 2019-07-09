import React, { useState } from 'react';
import { Input, Empty, Row, Col } from 'antd';
import { connect, DispatchProp } from 'react-redux';
import { findTemplate } from '@redux/actions/actor';
import { List } from 'immutable';
import TemplateItem from '../../TemplateItem';
import styled from 'styled-components';
const Search = Input.Search;

const Body = styled.div`
  margin-top: 20px;
`;

export interface TemplateType {
  id: number;
  uuid: string;
  name: string;
  desc: string;
  info: string;
  avatar: string;
  layout: string;
  built_in: boolean;
  creatorId: number;
  createAt: string;
  updatedAt: string;
  deletedAt: string;
}

type SelectTemplateCallback = (template: TemplateType) => void;

/**
 * 渲染模板列表
 * 一行三列
 */
const TemplateList = (props: {
  list: List<any>;
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
              creator={item.get('creator_name') || '未知'}
              time={item.get('updateAt')}
              onCreate={() => props.onSelectTemplate(item.toJS())}
            />
          </Col>
        );
      })}
    </Row>
  );
};

interface Props extends DispatchProp<any> {
  findingResult: List<any>;
  getSuggestTemplate: List<any>;
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
            list={props.getSuggestTemplate}
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
  getSuggestTemplate: state.getIn(['actor', 'suggestTemplate']),
  findingResult: state.getIn(['actor', 'findingResult']),
}))(TemplateSelect);
