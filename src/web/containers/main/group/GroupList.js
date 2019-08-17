import React from 'react';
import { connect } from 'react-redux';
import config from '../../../../../config/project.config.js';
import ConvItem from '../../../components/ConvItem';
import dateHelper from '../../../../shared/utils/date-helper';
import { switchSelectGroup } from '../../../../redux/actions/group';
import GroupDetail from './GroupDetail';

import './GroupList.scss';

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

export default connect(
  (state) => ({
    groups: state.getIn(['group', 'groups']),
    selectedUUID: state.getIn(['group', 'selectedGroupUUID']),
    converses: state.getIn(['chat', 'converses']),
  }),
  (dispatch) => ({
    switchSelectGroup: (uuid) => dispatch(switchSelectGroup(uuid)),
  })
)(GroupList);
