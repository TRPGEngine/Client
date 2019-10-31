import React from 'react';
import { View, Text, FlatList, ListRenderItemInfo } from 'react-native';
import {
  NavigationScreenProps,
  NavigationScreenConfig,
  NavigationScreenOptions,
} from 'react-navigation';
import { connect } from 'react-redux';
import { TRPGState } from '@src/shared/redux/types/__all__';
import _uniq from 'lodash/uniq';
import _without from 'lodash/without';
import { getUserInfoCache } from '@src/shared/utils/cache-helper';
import { TAvatar } from '../components/TComponent';
import styled from 'styled-components/native';
import { Checkbox } from '@ant-design/react-native';

const ListItem = styled.TouchableOpacity`
  padding: 10px 0;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 0.5px;
  border-bottom-color: ${(props) => props.theme.color.borderBase};
`;

const UserAvatar = styled(TAvatar).attrs((props) => ({
  width: 40,
  height: 40,
}))`
  margin: 0 4px;
`;

interface Props
  extends NavigationScreenProps<{
    uuids: string[];
    onSelected: (selectedUUID: string[]) => void;
    title?: string;
  }> {}
interface State {
  selectedUUIDs: string[];
}

class UserSelectScreen extends React.Component<Props, State> {
  static navigationOptions: NavigationScreenConfig<NavigationScreenOptions> = (
    props: Partial<Props>
  ) => {
    return {
      title: props.navigation.getParam('title', undefined),
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
      <ListItem onPress={() => handleClick(!isChecked)}>
        <Checkbox
          checked={isChecked}
          onChange={(e) => {
            const checked = e.target.checked;
            handleClick(checked);
          }}
        />
        <UserAvatar name={name} uri={user.get('avatar')} />
        <Text>{name}</Text>
      </ListItem>
    );
  };

  render() {
    return (
      <View>
        <Text>选择用户</Text>
        <FlatList
          data={this.uuids}
          keyExtractor={(item) => item}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

export default connect((state: TRPGState) => {
  return {
    usercache: state.getIn(['cache', 'user']),
  };
})(UserSelectScreen);
