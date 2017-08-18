const React = require('react');
const { connect } = require('react-redux');
const MsgItem = require('../../components/MsgItem');
const scrollTo = require('../../utils/animatedScrollTo.js');

require('./ConverseDetail.scss');

class ConverseDetail extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      let container = this.refs.container;
      scrollTo.bottom(container, 400);
    },1000);
  }

  render() {
    return (
      <div className="conv-detail">
        <div className="conv-container" ref="container">
          <div className="msg-items" ref="msgItems">
            <MsgItem
              icon="http://img4.imgtn.bdimg.com/it/u=1627316970,161287288&fm=26&gp=0.jpg"
              name="admin"
              content="adsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsad"
              time="2017-08-17 13:48:46"
            />
            <MsgItem
              icon="http://img4.imgtn.bdimg.com/it/u=1627316970,161287288&fm=26&gp=0.jpg"
              name="admin"
              content="adsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsad"
              time="2017-08-17 13:48:46"
              me={true}
            />
            <MsgItem
              icon="http://img4.imgtn.bdimg.com/it/u=1627316970,161287288&fm=26&gp=0.jpg"
              name="admin"
              content="adsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsad"
              time="2017-08-17 13:48:46"
              me={false}
            />
            <MsgItem
              icon="http://img4.imgtn.bdimg.com/it/u=1627316970,161287288&fm=26&gp=0.jpg"
              name="admin"
              content="adsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsad"
              time="2017-08-17 13:48:46"
              me={false}
            />
            <MsgItem
              icon="http://img4.imgtn.bdimg.com/it/u=1627316970,161287288&fm=26&gp=0.jpg"
              name="admin"
              content="adsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsad"
              time="2017-08-17 13:48:46"
              me={true}
            />
            <MsgItem
              icon="http://img4.imgtn.bdimg.com/it/u=1627316970,161287288&fm=26&gp=0.jpg"
              name="admin"
              content="adsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsadadsad"
              time="2017-08-17 13:48:46"
              me={true}
            />
          </div>
        </div>
        <div className="send-msg-box">

        </div>
      </div>


    )
  }
}

module.exports = connect(
  state => ({

  })
)(ConverseDetail);
