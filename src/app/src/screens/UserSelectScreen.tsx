import React from 'react';
import {
  View,
  Text,
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
} from 'react-native';
import {
  NavigationScreenProps,
  NavigationScreenConfig,
  NavigationScreenOptions,
  NavigationActions,
} from 'react-navigation';
import { connect } from 'react-redux';
import { TRPGState } from '@src/shared/redux/types/__all__';
import _uniq from 'lodash/uniq';
import _without from 'lodash/without';
import _noop from 'lodash/noop';
import { getUserInfoCache } from '@shared/utils/cache-helper';
import { Checkbox } from '@ant-design/react-native';
import UserList, { UserAvatar, UserItem } from '@app/components/UserList';

interface Props
  extends NavigationScreenProps<{
    uuids: string[];
    onSelected: (selectedUUID: string[]) => void;
    title?: string;
    selectedUUIDs?: string[];
  }> {}
interface State {
  selectedUUIDs: string[];
}

class UserSelectScreen extends React.Component<Props, State> {
  static navigationOptions: NavigationScreenConfig<NavigationScreenOptions> = (
    props: Partial<Props>
  ) => {
    const uuids = props.navigation.getParam('uuids', []);
    const selectedUUIDs = props.navigation.getParam('selectedUUIDs', []);
    const onSelected = props.navigation.getParam('onSelected', _noop);

    return {
      headerTitle:
        selectedUUIDs.length > 0
          ? `已选择 ${selectedUUIDs.length} / ${uuids.length}`
          : props.navigation.getParam('title', '选择用户'),
      headerRight: (
        <View style={{ marginRight: 10 }}>
          <TouchableOpacity
            onPress={() => {
              onSelected(selectedUUIDs);
              props.navigation.dispatch(NavigationActions.back());
            }}
          >
            <Text>完成</Text>
          </TouchableOpacity>
        </View>
      ),
    };
  };

  state: Readonly<State> = {
    selectedUUIDs: [],
  };

  get uuids(): string[] {
    const uuids = this.props.navigation.getParam('uuids', []);
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
    const user = getUserInfoCache(uuid);
    const name = user.get('nickname') || user.get('username');
    const isChecked = selectedUUIDs.includes(uuid);

    const handleClick = (checked: boolean) => {
      if (checked) {
        this.setSelectedUUIDs(_uniq([...selectedUUIDs, uuid]));
      } else {
        this.setSelectedUUIDs(_without(selectedUUIDs, uuid));
      }
    };

    return (
      <UserItem onPress={() => handleClick(!isChecked)}>
        <Checkbox
          checked={isChecked}
          onChange={(e) => {
            const checked = e.target.checked;
            handleClick(checked);
          }}
        />
        <UserAvatar name={name} uri={user.get('avatar')} />
        <Text>{name}</Text>
      </UserItem>
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
