const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
  Image,
  TouchableOpacity,
} = require('react-native');
const {
  TButton,
} = require('../TComponent');
const sb = require('react-native-style-block');
const Base = require('./Base');
const filesize = require('filesize');
const config = require('../../../../config/project.config');
const appConfig = require('../../config.app');

class File extends Base {
  _handlePreview() {
    let data = this.props.info.data;
    fileuuid = data.fileuuid;
    // TODO: 等待实现
  }

  _handleDownload() {
    let data = this.props.info.data;
    fileuuid = data.fileuuid;
    // TODO: 等待实现
  }

  _handleClick() {
    let data = this.props.info.data;
    fileuuid = data.fileuuid;
    // TODO: 等待实现
    alert('打开文件页');
  }

  getContent() {
    const info = this.props.info;
    const data = info.data;
    return (
      <TouchableOpacity style={styles.container} onPress={() => this._handleClick()}>
        <View style={styles.fileInfo}>
          <Image style={styles.fileImage} source={appConfig.file.getFileImage(data.ext)} />
          <View style={styles.fileProps}>
            <Text style={styles.fileName} numberOfLines={1}>{data.originalname}</Text>
            <Text style={styles.fileSize}>{filesize(data.size)}</Text>
          </View>
        </View>
        {
          data.progress !== 1 ? (
            <View style={{width: (data.progress * 100) + '%'}}></View>
          ) : null
        }
      </TouchableOpacity>
    )
  }
}

const styles = {
  container: [
    {width: 180},
    sb.padding(4, 2),
  ],
  fileInfo: [
    sb.direction(),
  ],
  fileImage: [
    sb.size(50, 50),
    sb.radius(3),
    {marginRight: 8},
  ],
  fileProps: [
    sb.flex(),
  ],
  fileName: [
    {marginBottom: 10, marginTop: 2},
  ],
  fileSize: [
    sb.font(14),
    sb.color('#ccc'),
  ]
}

module.exports = connect()(File);
