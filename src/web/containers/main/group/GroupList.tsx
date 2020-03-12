import React, { useMemo } from 'react';
import config from '@shared/project.config';
import ConvItem from '@web/components/ConvItem';
import dateHelper from '@shared/utils/date-helper';
import { switchSelectGroup } from '@shared/redux/actions/group';
import GroupDetail from './GroupDetail';
import _get from 'lodash/get';
import _sortBy from 'lodash/sortBy';
import { TMemo } from '@shared/components/TMemo';
import {
  useTRPGSelector,
  useTRPGDispatch,
} from '@shared/hooks/useTRPGSelector';

import './GroupList.scss';

const GroupList: React.FC = TMemo((props) => {
  const selectedUUID = useTRPGSelector(
    (state) => state.group.selectedGroupUUID
  );
  const converses = useTRPGSelector((state) => state.chat.converses);
  const groups = useTRPGSelector((state) => state.group.groups);
  const dispatch = useTRPGDispatch();

  const groupList = useMemo(() => {
    return _sortBy(
      groups.map((item) => {
        let uuid = item.uuid;
        return {
          ...item,
          lastTime: _get(converses, [uuid, 'lastTime']) || 0,
          lastMsg: _get(converses, [uuid, 'lastMsg']),
          unread: _get(converses, [uuid, 'unread']),
        };
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
            isSelected={selectedUUID === uuid}
            onClick={() => dispatch(switchSelectGroup(uuid))}
            hideCloseBtn={true}
          />
        );
      });
  }, [converses, groups, selectedUUID, dispatch]);

  return (
    <div className="group">
      <div className="list">{groupList}</div>
      {selectedUUID ? (
        <GroupDetail />
      ) : (
        <div className="none-select-group">
          <i className="iconfont">&#xe60b;</i>
          <div className="welcome">一直在跑团，从来不咕咕...大概</div>
        </div>
      )}
    </div>
  );
});
GroupList.displayName = 'GroupList';

export default GroupList;
