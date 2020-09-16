import React, { useState, useCallback, useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Select, Button, Input, Empty } from 'antd';
import styled from 'styled-components';
import {
  useTRPGDispatch,
  useTRPGSelector,
} from '@shared/hooks/useTRPGSelector';
import { findGroup } from '@redux/actions/group';
import _isEmpty from 'lodash/isEmpty';
import { Loading } from '@web/components/Loading';
import FindResultItem from '@web/components/FindResultItem';

const SearchBar = styled.div`
  display: flex;
`;

const NoneResult = styled(Empty).attrs({
  description: '暂无搜索结果',
})`
  padding: 60px 0;
  color: ${(props) => props.theme.color.textNormal};
`;

const options = [
  { value: 'uuid', label: '团唯一标示符' },
  { value: 'groupname', label: '团名称' },
  { value: 'groupdesc', label: '团简介' },
];

export const FindGroup: React.FC = TMemo(() => {
  const [selectValue, setSelectValue] = useState('groupname');
  const [searchText, setSearchText] = useState('');
  const isFinding = useTRPGSelector((state) => state.group.isFindingGroup);
  const findingResult = useTRPGSelector((state) => state.group.findingResult);
  const dispatch = useTRPGDispatch();

  const groupResult = useMemo(() => {
    if (isFinding) {
      return <Loading style={{ paddingTop: 60 }} description="正在搜索中..." />;
    }

    if (_isEmpty(findingResult)) {
      return <NoneResult />;
    }

    return (
      <div>
        {findingResult.map((item, index) => (
          <FindResultItem
            key={item.uuid + '#' + index}
            info={item}
            type="group"
          />
        ))}
      </div>
    );
  }, [isFinding, findingResult]);

  const handleSearch = useCallback(() => {
    const text = searchText.trim();
    const type = selectValue;

    if (text === '') {
      console.log('搜索内容不能为空');
      return;
    }

    dispatch(findGroup(text, type));
  }, [searchText, selectValue]);

  return (
    <div>
      <SearchBar>
        <Input
          size="large"
          placeholder="请输入你要搜索的团..."
          onPressEnter={handleSearch}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Select
          style={{ width: 220 }}
          size="large"
          value={selectValue}
          options={options}
          placeholder="请选择搜索方式..."
          onChange={(value) => setSelectValue(value)}
        />

        <Button size="large" onClick={handleSearch}>
          搜索
        </Button>
      </SearchBar>

      <div>{groupResult}</div>
    </div>
  );
});
FindGroup.displayName = 'FindGroup';
