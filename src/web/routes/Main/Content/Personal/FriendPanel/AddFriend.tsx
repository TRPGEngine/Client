import React, { useMemo, useState, useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Select, Input, Button, Empty } from 'antd';
import {
  useTRPGSelector,
  useTRPGDispatch,
} from '@shared/hooks/useTRPGSelector';
import _isEmpty from 'lodash/isEmpty';
import FindResultItem from '@web/components/FindResultItem';
import { findUser } from '@redux/actions/user';
import styled from 'styled-components';
import { Loading } from '@web/components/Loading';

const options = [
  { value: 'uuid', label: '用户唯一标示符' },
  { value: 'username', label: '用户名' },
  { value: 'nickname', label: '昵称' },
];

const Root = styled.div``;

const SearchBar = styled.div`
  display: flex;
`;

const NoneResult = styled(Empty).attrs({
  description: '暂无搜索结果',
})`
  padding: 60px 0;
  color: ${(props) => props.theme.color.textNormal};
`;

export const AddFriend: React.FC = TMemo(() => {
  const [selectValue, setSelectValue] = useState('username');
  const [searchText, setSearchText] = useState('');
  const isFinding = useTRPGSelector((state) => state.user.isFindingUser);
  const findingResult = useTRPGSelector((state) => state.user.findingResult);
  const dispatch = useTRPGDispatch();

  const friendResult = useMemo(() => {
    if (isFinding) {
      return <Loading style={{ paddingTop: 60 }} description="正在搜索中..." />;
    }

    if (_isEmpty(findingResult)) {
      return <NoneResult />;
    }

    return findingResult.map(function(item, index) {
      return <FindResultItem key={item.uuid + '#' + index} info={item} />;
    });
  }, [isFinding, findingResult]);

  const handleSearch = useCallback(() => {
    const text = searchText.trim();
    const type = selectValue;
    if (!!text) {
      dispatch(findUser(text, type));
    } else {
      console.log('搜索内容不能为空');
    }
  }, [searchText, selectValue]);

  return (
    <Root>
      <SearchBar>
        <Input
          size="large"
          placeholder="请输入你要添加的好友信息"
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
      <div className="friends-search-result">{friendResult}</div>
    </Root>
  );
});
AddFriend.displayName = 'AddFriend';
