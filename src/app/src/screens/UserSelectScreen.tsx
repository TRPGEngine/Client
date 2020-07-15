import React from 'react';
import { View, Text, ListRenderItemInfo } from 'react-native';
import { connect } from 'react-redux';
import { TRPGState } from '@src/shared/redux/types/__all__';
import _uniq from 'lodash/uniq';
import _without from 'lodash/without';
import _noop from 'lodash/noop';
import { Checkbox } from '@ant-design/react-native';
import UserList from '@app/components/UserList';
import { TRPGStackScreenProps } from '@app/router';
import { UserItem } from '@app/components/UserItem';

interface Props extends TRPGStackScreenProps<'UserSelect'> {}
interface State {
  selectedUUIDs: string[];
}

class UserSelectScreen extends React.Component<Props, State> {
  state: Readonly<State> = {
    selectedUUIDs: [],
  };

  get uuids(): string[] {
    const uuids = this.props.route.params?.uuids ?? [];
    return _uniq(uuids);
  }

  setSelectedUUIDs(newSelectedUUIDs: string[]) {
    this.props.navigation.setParams({ selectedUUIDs: newSelectedUUIDs });
    this.setState({
      selectedUUIDs: newSelectedUUIDs,
    });
  }

  renderItem = ({ item }: ListRenderItemInfo<string>) => {
    const { selectedUUIDs } = this.state;
    const uuid = item;
    const isChecked = selectedUUIDs.includes(uuid);

    const handleClick = (checked: boolean) => {
      if (checked) {
        this.setSelectedUUIDs(_uniq([...selectedUUIDs, uuid]));
      } else {
        this.setSelectedUUIDs(_without(selectedUUIDs, uuid));
      }
    };

    return (
      <UserItem
        uuid={uuid}
        prefix={
          <Checkbox
            checked={isChecked}
            onChange={(e) => {
              const checked = e.target.checked;
              handleClick(checked);
            }}
          />
        }
        onPress={() => handleClick(!isChecked)}
      />
    );
  };

  render() {
    return (
      <View>
        <Text>选择用户</Text>
        <UserList uuids={this.uuids} renderItem={this.renderItem} />
      </View>
    );
  }
}

export default connect((state: TRPGState) => {
  return {
    usercache: state.cache.user,
  };
})(UserSelectScreen);
