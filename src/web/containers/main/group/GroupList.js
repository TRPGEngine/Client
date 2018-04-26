const React = require('react');
const { connect } = require('react-redux');
const config = require('../../../../../config/project.config.js');
const ConvItem = require('../../../components/ConvItem');
const dateHelper = require('../../../../utils/dateHelper');
const { switchSelectGroup } = require('../../../../redux/actions/group');
const GroupDetail = require('./GroupDetail');

require('./GroupList.scss');

class GroupList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputMsg: '',
      inputType: 'normal',
      isSlidePanelShow: false,
      slidePanelTitle: '',
      slidePanelContent: null,
      selectedActorUUID: 'uuiduuid',
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.sildeEvent);
    this.sildeEvent = null;
  }

  getGroupList() {
    return this.props.groups.map((item, index) => {
      let uuid = item.get('uuid');
      let lastTime = this.props.converses.getIn([uuid, 'lastTime']);
      let lastMsg = this.props.converses.getIn([uuid, 'lastMsg']);
      let unread = this.props.converses.getIn([uuid, 'unread']);
      return (
        <ConvItem
          key={uuid+'#'+index}
          icon={item.get('avatar') || config.defaultImg.group}
          title={item.get('name')}
          content={lastMsg}
          time={lastTime?dateHelper.getShortDiff(lastTime):''}
          uuid={uuid}
          unread={unread}
          isSelected={this.props.selectedUUID === uuid}
          onClick={() => this.props.switchSelectGroup(uuid)}
          hideCloseBtn={true}
        />
      )
    })
  }

  render() {
    return (
      <div className="group">
        <div className="list">
          { this.getGroupList() }
        </div>
        { this.props.selectedUUID ? (
          <GroupDetail />
        ) : (
          <div className="none-select-group">
            <i className="iconfont">&#xe60b;</i>
            <div className="welcome">
              一直在跑团，从来不咕咕...大概
            </div>
          </div>
        ) }
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    groups: state.getIn(['group', 'groups']),
    selectedUUID: state.getIn(['group', 'selectedGroupUUID']),
    converses: state.getIn(['chat', 'converses']),
  }),
  dispatch => ({
    switchSelectGroup: (uuid) => dispatch(switchSelectGroup(uuid)),
  })
)(GroupList);
