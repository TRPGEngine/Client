import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  FlatList,
} from 'react-native';
import sb from 'react-native-style-block';
import { TIcon, TInput, TAvatar } from '../components/TComponent';
import { findUser } from '@shared/redux/actions/user';
import { findGroup } from '@shared/redux/actions/group';
import { switchNav, navProfile } from '../redux/actions/nav';
import styled from 'styled-components/native';
import { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';
import { TRPGStackScreenProps } from '@app/router';

const TextTip = styled.Text`
  text-align: center;
  margin-top: 20px;
`;

interface Props extends TRPGDispatchProp, TRPGStackScreenProps<'AddFriend'> {
  isFinding: boolean;
  userFindingResult: any;
  groupFindingResult: any;
}
class AddFriendScreen extends React.Component<Props> {
  state = {
    searchValue: '',
    showSearchResult: false,
    searchType: 'user',
  };

  handleSearchUser() {
    let searchValue = this.state.searchValue.trim();
    console.log('搜索用户:', searchValue);
    Keyboard.dismiss();
    this.setState({ showSearchResult: true, searchType: 'user' });
    this.props.dispatch(findUser(searchValue, 'username'));
  }

  handleSearchGroup() {
    let searchValue = this.state.searchValue.trim();
    console.log('搜索团:', searchValue);
    Keyboard.dismiss();

    this.setState({ showSearchResult: true, searchType: 'group' });
    this.props.dispatch(findGroup(searchValue, 'groupname'));
  }

  /**
   * 搜索结果列表
   * @param data 列表数据源
   * @param onPress 点击后回调
   */
  getSearchList(data: any[], onPress: (item: any) => void) {
    return data.length > 0 ? (
      <FlatList
        style={styles.searchResultList}
        data={data}
        keyExtractor={(item, index) => item.uuid + index}
        renderItem={({ item }) => {
          const name = item.name;

          return (
            <TouchableOpacity
              style={styles.searchResultListItem}
              onPress={() => onPress(item)}
            >
              <TAvatar
                style={styles.searchResultListItemAvatar}
                uri={item.avatar}
                name={name}
                width={36}
                height={36}
              />
              <Text>{name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    ) : (
      <TextTip>没有找到符合条件的搜索结果</TextTip>
    );
  }

  getSearchResult() {
    if (!this.state.searchValue) {
      return;
    }

    if (!this.state.showSearchResult) {
      return (
        <View style={styles.searchResult}>
          <TouchableOpacity
            onPress={() => this.handleSearchUser()}
            style={styles.searchResultItem}
          >
            <TIcon
              icon="&#xe604;"
              style={[...styles.searchResultIcon, sb.bgColor('#16a085')]}
            />
            <Text>
              搜索用户:{' '}
              <Text style={styles.searchResultHighlight}>
                {this.state.searchValue}
              </Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.handleSearchGroup()}
            style={styles.searchResultItem}
          >
            <TIcon
              icon="&#xe61c;"
              style={[...styles.searchResultIcon, sb.bgColor('#d35400')]}
            />
            <Text>
              搜索团:{' '}
              <Text style={styles.searchResultHighlight}>
                {this.state.searchValue}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      if (this.props.isFinding) {
        return <Text style={styles.searchResultTip}>正在搜索中...</Text>;
      } else {
        // 显示搜索结果列表
        if (this.state.searchType === 'user') {
          let userFindingResult = this.props.userFindingResult
            ? this.props.userFindingResult
            : [];

          return this.getSearchList(
            userFindingResult.map((item) => ({
              ...item,
              name: item.nickname || item.username,
            })),
            (item) => this.props.dispatch(navProfile(item.uuid, item.name))
          );
        } else if (this.state.searchType === 'group') {
          let resultList = this.props.groupFindingResult
            ? this.props.groupFindingResult
            : [];

          return this.getSearchList(resultList, (item) =>
            this.props.dispatch(
              switchNav('GroupProfile', { uuid: item.uuid, name: item.name })
            )
          );
        } else {
          return <TextTip>搜索结果异常</TextTip>;
        }
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <TIcon icon="&#xe60a;" style={styles.searchBarIcon} />
          <TInput
            style={styles.searchBarInput}
            value={this.state.searchValue}
            onChangeText={(searchValue) =>
              this.setState({ searchValue, showSearchResult: false })
            }
            placeholder="用户名/团名/uuid"
            returnKeyType="search"
            onSubmitEditing={() => this.handleSearchUser()}
          />
        </View>

        {this.getSearchResult()}
      </View>
    );
  }
}

const styles = {
  container: [sb.padding(10, 0, 0, 0), sb.flex()],
  searchBar: [
    sb.bgColor(),
    sb.padding(10, 12),
    sb.direction(),
    sb.alignCenter(),
  ],
  searchBarIcon: [sb.font(18), sb.margin(0, 10, 0, 0)],
  searchBarInput: [sb.color('#333'), sb.border('all', 0), sb.flex()],
  searchResult: [sb.margin(10, 0), sb.bgColor()],
  searchResultItem: [
    sb.direction(),
    sb.alignCenter(),
    sb.margin(0, 0, 0, 10),
    sb.padding(10, 0),
    sb.border('Bottom', 0.5, '#ccc'),
  ],
  searchResultIcon: [
    sb.padding(10),
    sb.color(),
    sb.radius(3),
    sb.margin(0, 8, 0, 0),
    sb.font(18),
  ],
  searchResultHighlight: [sb.color('#e74c3c')],
  searchResultTip: [sb.margin(10), sb.textAlign('center'), sb.color('#ccc')],
  searchResultList: [
    sb.flex(),
    sb.margin(10, 0, 0, 0),
    sb.bgColor(),
    sb.padding(4, 4),
  ],
  searchResultListItem: [
    sb.direction(),
    sb.alignCenter(),
    sb.padding(8, 0),
    sb.margin(0, 0, 0, 10),
    sb.border('Bottom', 0.5, '#ccc'),
  ],
  searchResultListItemAvatar: [sb.margin(0, 10, 0, 0)],
};

export default connect((state: TRPGState) => ({
  isFinding: state.user.isFindingUser ?? state.group.isFindingGroup,
  userFindingResult: state.user.findingResult,
  groupFindingResult: state.group.findingResult,
}))(AddFriendScreen);
