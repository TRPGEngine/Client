import React from 'react';
import { connect } from 'react-redux';
import config from '../../../../shared/project.config';
import ConvItem from '../../../components/ConvItem';
import dateHelper from '../../../../shared/utils/date-helper';
import { switchSelectGroup } from '../../../../shared/redux/actions/group';
import GroupDetail from './GroupDetail';
import _get from 'lodash/get';
import _sortBy from 'lodash/sortBy';

import './GroupList.scss';
import {
  TRPGState,
  TRPGDispatch,
  TRPGDispatchProp,
} from '@src/shared/redux/types/__all__';

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
    const converses = this.props.converses;
    return _sortBy(
      this.props.groups.map((item) => {
        let uuid = item.uuid;
        return item
          .set('lastTime', _get(converses, [uuid, 'lastTime']) || 0)
          .set('lastMsg', _get(converses, [uuid, 'lastMsg']))
          .set('unread', _get(converses, [uuid, 'unread']));
      }),
      (x) => new Date(x.lastTime)
    )
      .reverse()
      .map((item, index) => {
        const uuid = item.uuid;
        let name = item.name;
        if (item.status) {
          name += '(开团中...)';
        }
        const icon = item.avatar || config.defaultImg.getGroup(name);

        return (
          <ConvItem
            key={uuid + '#' + index}
            icon={icon}
            title={name}
            content={item.lastMsg}
            time={item.lastTime ? dateHelper.getShortDiff(item.lastTime) : ''}
            uuid={uuid}
            unread={item.unread}
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
    groups: state.group.groups,
    selectedUUID: state.group.selectedGroupUUID,
    converses: state.chat.converses,
  }),
  (dispatch: TRPGDispatch) => ({
    switchSelectGroup: (uuid: string) => dispatch(switchSelectGroup(uuid)),
  })
)(GroupList);
