const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  FlatList,
} = require('react-native');
const sb = require('react-native-style-block');
const {
  TIcon,
  TInput,
  TAvatar,
} = require('../components/TComponent');
const { findUser } = require('../../redux/actions/user');
const { findGroup } = require('../../redux/actions/group');

class AddFriendScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      showSearchResult: false,
      searchType: 'user',
    };
  }

  _handleSearchUser() {
    let searchValue = this.state.searchValue.trim();
    console.log('搜索用户:', searchValue);
    Keyboard.dismiss();
    this.setState({showSearchResult: true, searchType: 'user'});
    this.props.dispatch(findUser(searchValue, 'username'));
  }

  _handleSearchGroup() {
    let searchValue = this.state.searchValue.trim();
    console.log('搜索团:', searchValue);
    Keyboard.dismiss();

    this.setState({showSearchResult: true, searchType: 'group'});
    this.props.dispatch(findGroup(searchValue, 'groupname'));
  }

  getSearchResult() {
    if(!this.state.searchValue) {
      return;
    }

    if(!this.state.showSearchResult) {
      return (
        <View style={styles.searchResult}>
          <TouchableOpacity onPress={() => this._handleSearchUser()} style={styles.searchResultItem}>
            <TIcon icon="&#xe604;" style={[...styles.searchResultIcon, sb.bgColor('#16a085')]} />
            <Text>搜索用户: <Text style={styles.searchResultHighlight}>{this.state.searchValue}</Text></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._handleSearchGroup()} style={styles.searchResultItem}>
            <TIcon icon="&#xe61c;" style={[...styles.searchResultIcon, sb.bgColor('#d35400')]} />
            <Text>搜索团: <Text style={styles.searchResultHighlight}>{this.state.searchValue}</Text></Text>
          </TouchableOpacity>
        </View>
      )
    }else {
      if(this.props.isFinding) {
        return (
          <Text style={styles.searchResultTip}>正在搜索中...</Text>
        )
      }else {
        // 显示搜索结果列表
        if(this.state.searchType === 'user') {
          let userFindingResult = this.props.userFindingResult ? this.props.userFindingResult.toJS() : [];

          return (
            <FlatList
              style={styles.searchResultList}
              data={userFindingResult}
              keyExtractor={(item, index) => item.uuid + index}
              renderItem={({item}) => {
                let name = item.nickname || item.username;
                return (
                  <TouchableOpacity
                    style={styles.searchResultListItem}
                    onPress={() => alert('TODO:显示用户资料' + item.uuid)}
                  >
                    <TAvatar style={styles.searchResultListItemAvatar} uri={item.avatar} name={name} width={36} height={36} />
                    <Text>{name}</Text>
                  </TouchableOpacity>
                )
              }}
            />
          )
        }else if(this.state.searchType === 'group') {
          let resultList = this.props.groupFindingResult ? this.props.groupFindingResult.toJS() : [];

          return (
            <FlatList
              style={styles.searchResultList}
              data={resultList}
              keyExtractor={(item, index) => item.uuid + index}
              renderItem={({item}) => {
                let name = item.name;
                return (
                  <TouchableOpacity
                    style={styles.searchResultListItem}
                    onPress={() => alert('TODO:显示团资料' + item.uuid)}
                  >
                    <TAvatar style={styles.searchResultListItemAvatar} uri={item.avatar} name={name} width={36} height={36} />
                    <Text>{name}</Text>
                  </TouchableOpacity>
                )
              }}
            />
          )
        }else {
          return (
            <Text>搜索结果异常</Text>
          )
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
            onChangeText={searchValue => this.setState({searchValue, showSearchResult: false})}
            placeholder="用户名/团名/uuid"
            returnKeyType="search"
            onSubmitEditing={() => this._handleSearchUser()}
          />
        </View>

        { this.getSearchResult() }
      </View>
    )
  }
}

const styles = {
  container: [
    sb.padding(10, 0, 0, 0),
    sb.flex(),
  ],
  searchBar: [
    sb.bgColor(),
    sb.padding(10, 12),
    sb.direction(),
    sb.alignCenter(),
  ],
  searchBarIcon: [
    sb.font(18),
    sb.margin(0, 10, 0, 0),
  ],
  searchBarInput: [
    sb.color('#333'),
    sb.border('all', 0),
    sb.flex(),
  ],
  searchResult: [
    sb.margin(10, 0),
    sb.bgColor(),
  ],
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
  searchResultHighlight: [
    sb.color('#e74c3c'),
  ],
  searchResultTip: [
    sb.margin(10),
    sb.textAlign('center'),
    sb.color('#ccc'),
  ],
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
    sb.border('Bottom', 0.5, '#ccc')
  ],
  searchResultListItemAvatar: [
    sb.margin(0, 10, 0, 0),
  ],
}

module.exports = connect(
  state => ({
    isFinding: state.getIn(['user', 'isFindingUser']) || state.getIn(['group', 'isFindingGroup']),
    userFindingResult: state.getIn(['user', 'findingResult']),
    groupFindingResult: state.getIn(['group', 'findingResult']),
  })
)(AddFriendScreen);
