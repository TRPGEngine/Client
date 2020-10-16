import React, { Fragment, useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import ModalPanel from '../ModalPanel';
import { Select, Collapse, Button, Empty } from 'antd';
import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import _flatten from 'lodash/flatten';
import _uniq from 'lodash/uniq';
import _without from 'lodash/without';
import _isEqual from 'lodash/isEqual';
import _isFunction from 'lodash/isFunction';
import { useCachedUserInfo } from '@shared/hooks/useCache';
import { OptionProps, OptionType } from 'antd/lib/select';
import { GroupInfo } from '@redux/types/group';
import Avatar from '../Avatar';

const Option = Select.Option;
const Panel = Collapse.Panel;

const Container = styled.div`
  display: flex;
  height: 100%;

  > div {
    flex: 1;
  }

  .select-user {
    border: ${(props) => props.theme.border.standard};

    .ant-select-selection {
      background-color: transparent;
      border: 0;
      box-shadow: none !important;

      &:focus,
      &:active {
        border: 0 !important;
        box-shadow: none !important;
      }
    }
  }

  .user-list {
    height: 100%;
    overflow: auto;

    .ant-collapse {
      border-radius: 0;
      .ant-collapse-content-box {
        padding: 0;
      }
    }
  }
`;

const UserItemName: React.FC<{ uuid: string }> = React.memo(({ uuid }) => {
  const userInfo = useCachedUserInfo(uuid);
  const name = userInfo.nickname ?? userInfo.username ?? '';
  const avatar = userInfo.avatar;

  return (
    <Fragment>
      <Avatar src={avatar} name={name} />
      <span style={{ marginLeft: 4 }}>{name}</span>
    </Fragment>
  );
});
UserItemName.displayName = 'UserItemName';

interface SelectedUserProps {
  uuids: string[];
  allUserUUIDs: string[];
  onChange?: (uuid: string[]) => void;
}
const SelectedUser: React.FC<SelectedUserProps> = React.memo((props) => {
  const value = useMemo(() => {
    return props.uuids.map((uuid) => ({ key: uuid }));
  }, [props.uuids]);

  const filterOption = useCallback((inputValue: string, option: any) => {
    const label: string = option.props.label ?? '';

    return label.includes(inputValue);
  }, []);

  const handleChange = useCallback(
    (items) => {
      const uuids: string[] = items.map((item) => item.key);
      _isFunction(props.onChange) && props.onChange(uuids);
    },
    [props.onChange]
  );

  return (
    <Select
      mode="multiple"
      labelInValue={true}
      value={value as any}
      placeholder="选择用户"
      filterOption={filterOption}
      onChange={handleChange}
      style={{ width: '100%' }}
    >
      {props.allUserUUIDs.map((uuid) => {
        // 这里可能会有点问题。但没想到比较好的解决方案
        const userInfo = useCachedUserInfo(uuid);
        const name = userInfo.nickname ?? userInfo.username ?? '';

        return (
          <Option key={uuid} value={uuid} label={name}>
            {name}
          </Option>
        );
      })}
    </Select>
  );
});
SelectedUser.displayName = 'SelectedUser';

const UserListItem = styled.div<{ selected: boolean }>`
  text-align: left;
  padding: 6px 12px;

  user-select: none;
  cursor: pointer;
  color: ${(props) => (props.selected ? props.theme.color.silver : 'inherit')};

  &:hover {
    background: ${(props) => props.theme.color.transparent90};
  }
`;

interface AllUserListProps {
  selectedUUIDs: string[];
  allUsers: {
    name: string;
    uuids: string[];
  }[];
  onSelectUUID: (uuid: string) => void;
}
const AllUserList: React.FC<AllUserListProps> = React.memo((props) => {
  const panels = useMemo(() => {
    return props.allUsers.map((item, index) => (
      <Panel header={item.name} key={index} style={{ padding: 0 }}>
        {item.uuids.length > 0 ? (
          item.uuids.map((uuid) => (
            <UserListItem
              key={uuid}
              onClick={() => props.onSelectUUID(uuid)}
              selected={props.selectedUUIDs.includes(uuid)}
            >
              <UserItemName uuid={uuid} />
            </UserListItem>
          ))
        ) : (
          // <p style={}>暂无符合条件的用户</p>
          <Empty />
        )}
      </Panel>
    ));
  }, [props.selectedUUIDs, props.allUsers, props.onSelectUUID]);

  return (
    <div>
      <Collapse defaultActiveKey={[0]}>{panels}</Collapse>
    </div>
  );
});
AllUserList.displayName = 'AllUserList';

interface Props {
  /**
   * 排除的UUID
   */
  excludeUUIDs?: string[];

  onConfirm?: (uuids: string[]) => void;
}
export const UserSelector: React.FC<Props> = React.memo((props) => {
  const [selectedUUIDs, setSelectedUUIDs] = useState<string[]>([]);
  const { excludeUUIDs = [] } = props;

  const friends = useTRPGSelector<string[]>((state) => state.user.friendList);
  const groups = useTRPGSelector<GroupInfo[]>((state) => state.group.groups);

  const allUsers = useMemo(() => {
    return [
      {
        name: '好友',
        uuids: friends.filter((uuid) => !excludeUUIDs.includes(uuid)),
      },
      ...groups.map((group) => ({
        name: group.name,
        uuids: (group.group_members ?? []).filter(
          (uuid) => !excludeUUIDs.includes(uuid)
        ),
      })),
    ];
  }, [friends, groups, excludeUUIDs]);

  const allUserUUIDs: string[] = useMemo(() => {
    return _uniq(_flatten(allUsers.map((x) => x.uuids)));
  }, [allUsers]);

  const handleAppendUUID = useCallback(
    (uuid) => {
      if (selectedUUIDs.includes(uuid)) {
        setSelectedUUIDs(_without(selectedUUIDs, uuid));
      } else {
        setSelectedUUIDs([...selectedUUIDs, uuid]);
      }
    },
    [selectedUUIDs, setSelectedUUIDs]
  );

  const handleConfirm = useCallback(() => {
    _isFunction(props.onConfirm) && props.onConfirm(selectedUUIDs);
  }, [selectedUUIDs, props.onConfirm]);
  const actions = useMemo(() => {
    return <Button onClick={handleConfirm}>确认</Button>;
  }, [handleConfirm]);

  return useMemo(
    () => (
      <ModalPanel
        title="选择用户"
        style={{ width: 600, height: 480 }}
        actions={actions}
      >
        <Container>
          <div className="select-user">
            <SelectedUser
              uuids={selectedUUIDs}
              allUserUUIDs={allUserUUIDs}
              onChange={setSelectedUUIDs}
            />
          </div>
          <div className="user-list">
            <AllUserList
              selectedUUIDs={selectedUUIDs}
              allUsers={allUsers}
              onSelectUUID={handleAppendUUID}
            />
          </div>
        </Container>
      </ModalPanel>
    ),
    [
      actions,
      selectedUUIDs,
      allUserUUIDs,
      setSelectedUUIDs,
      allUsers,
      handleAppendUUID,
    ]
  );
});
UserSelector.displayName = 'UserSelector';
