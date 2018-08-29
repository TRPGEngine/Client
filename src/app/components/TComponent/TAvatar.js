const React = require('react');
const {
  View,
  Text,
  Image,
} = require('react-native');
const sb = require('react-native-style-block');
const config = require('../../../../config/project.config');
const str2int = require('str2int');

class TAvatar extends React.Component {
  static defaultProps = {
    uri: '',
    name: '',
    style: [],
    capitalSize: 20,
    height: 100,
    width: 100,
  }

  getColor(name) {
    const color = config.defaultImg.color;
    const id = str2int(name);
    return color[id % color.length];
  }

  render() {
    let {
      uri,
      name,
      style,
      capitalSize,
      height,
      width,
    } = this.props;

    if(!style instanceof Array) {
      style = [style];
    }

    if(uri && typeof uri === 'string') {
      uri = {uri};
    }

    let capital = name[0];
    if(capital) {
      capital = capital.toUpperCase();
    }
    let color = this.getColor(name);

    if(uri) {
      return (
        <Image style={[...style, {height, width}]} source={uri} />
      )
    }else {
      return (
        <View style={[...style, {backgroundColor: color, height, width}, sb.center()]}>
          <Text style={[...styles.capital, {fontSize: capitalSize}]}>{capital}</Text>
        </View>
      )
    }
  }
}

const styles = {
  capital: [
    {
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    sb.color(),
  ]
}

module.exports = TAvatar;
