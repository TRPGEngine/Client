const React = require('react');
const { connect } = require('react-redux');
const config = require('../../../../../config/project.config.js');
const ConvItem = require('../../../components/ConvItem');
const dateHelper = require('../../../../shared/utils/dateHelper');
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
    };
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.sildeEvent);
    this.sildeEvent = null;
  }

  getGroupList() {
    return this.props.groups
      .map((item) => {
        let uuid = item.get('uuid');
        return item
          .set('lastTime', this.props.converses.getIn([uuid, 'lastTime']) || 0)
          .set('lastMsg', this.props.converses.getIn([uuid, 'lastMsg']))
          .set('unread', this.props.converses.getIn([uuid, 'unread']));
      })
      .sortBy((item) => new Date(item.get('lastTime')))
      .reverse()
      .map((item, index) => {
        let uuid = item.get('uuid');
        let name = item.get('name');
        if (item.get('status')) {
          name += '(开团中...)';
        }
        return (
          <ConvItem
            key={uuid + '#' + index}
            icon={item.get('avatar') || config.defaultImg.group}
            title={name}
            content={item.get('lastMsg')}
            time={
              item.get('lastTime')
                ? dateHelper.getShortDiff(item.get('lastTime'))
                : ''
            }
            uuid={uuid}
            unread={item.get('unread')}
            isSelected={this.props.selectedUUID === uuid}
            onClick={() => this.props.switchSelectGroup(uuid)}
            hideCloseBtn={true}
          />
        );
      });
  }

  render() {
    return (
      <div className="group">
        <div className="list">{this.getGroupList()}</div>
        {this.props.selectedUUID ? (
          <GroupDetail />
        ) : (
          <div className="none-select-group">
            <i className="iconfont">&#xe60b;</i>
            <div className="welcome">一直在跑团，从来不咕咕...大概</div>
          </div>
        )}
      </div>
    );
  }
}

module.exports = connect(
  (state) => ({
    groups: state.getIn(['group', 'groups']),
    selectedUUID: state.getIn(['group', 'selectedGroupUUID']),
    converses: state.getIn(['chat', 'converses']),
  }),
  (dispatch) => ({
    switchSelectGroup: (uuid) => dispatch(switchSelectGroup(uuid)),
  })
)(GroupList);
