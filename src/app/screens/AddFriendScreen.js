const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
  Image,
  TouchableOpacity,
} = require('react-native');
const sb = require('react-native-style-block');
const {
  TIcon,
  TInput,
} = require('../components/TComponent');

class AddFriendScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
    };
  }

  _handleSearchUser() {
    console.log('搜索用户:', this.state.searchValue);
  }

  _handleSearchGroup() {
    console.log('搜索团:', this.state.searchValue);
  }

  getSearchResult() {
    if(this.state.searchValue) {
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
            onChangeText={searchValue => this.setState({searchValue})}
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
    sb.padding(10, 0),
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
}

module.exports = connect()(AddFriendScreen);
