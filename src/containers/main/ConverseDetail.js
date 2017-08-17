const React = require('react');
const { connect } = require('react-redux');
const MsgItem = require('../../components/MsgItem');

class ConverseDetail extends React.Component {
  render() {
    return (
      <div className="msg-items">
        <MsgItem
          icon="http://img4.imgtn.bdimg.com/it/u=1627316970,161287288&fm=26&gp=0.jpg"
          name="admin"
          content="adsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsad"
          time="2017-08-17 13:48:46"
        />
      </div>
    )
  }
}

module.exports = connect(
  state => ({

  })
)(ConverseDetail);
