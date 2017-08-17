const React = require('react');
const { connect } = require('react-redux');

const ConverseDetail = require('./ConverseDetail');
const ConvItem = require('../../components/ConvItem');

require('./ConverseList.scss');

class ConverseList extends React.Component {
  render() {
    return (
      <div className="converse">
        <div className="list">
          <ConvItem
            icon="http://img4.imgtn.bdimg.com/it/u=1627316970,161287288&fm=26&gp=0.jpg"
            title="admin"
            content="adsad"
            time="05-10"
          />
        </div>
        <div className="detail">
          <ConverseDetail />
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({

  })
)(ConverseList);
