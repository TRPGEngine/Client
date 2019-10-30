import React from 'react';
import { connect } from 'react-redux';
import config from '../../../../shared/project.config';
import ConvItem from '../../../components/ConvItem';
import dateHelper from '../../../../shared/utils/date-helper';
import { switchSelectGroup } from '../../../../shared/redux/actions/group';
import GroupDetail from './GroupDetail';

import './GroupList.scss';
import {
  TRPGState,
  TRPGDispatch,
  TRPGDispatchProp,
} from '@src/shared/redux/types/redux';

interface Props extends TRPGDispatchProp {
  groups: any;
  converses: any;
  selectedUUID: string;
  switchSelectGroup: any;
}
class GroupList extends React.Component<Props> {
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
        const uuid = item.get('uuid');
        let name = item.get('name');
        if (item.get('status')) {
          name += '(开团中...)';
        }
        const icon = item.get('avatar') || config.defaultImg.getGroup(name);

        return (
          <ConvItem
            key={uuid + '#' + index}
            icon={icon}
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
  (state: TRPGState) => ({
    groups: state.getIn(['group', 'groups']),
    selectedUUID: state.getIn(['group', 'selectedGroupUUID']),
    converses: state.getIn(['chat', 'converses']),
  }),
  (dispatch: TRPGDispatch) => ({
    switchSelectGroup: (uuid: string) => dispatch(switchSelectGroup(uuid)),
  })
)(GroupList);
