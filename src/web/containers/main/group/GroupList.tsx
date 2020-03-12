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
import { useConverses } from '@redux/hooks/useConverses';

const GroupList: React.FC = TMemo((props) => {
  const selectedUUID = useTRPGSelector(
    (state) => state.group.selectedGroupUUID
  );
  const dispatch = useTRPGDispatch();
  const converses = useConverses(['group']);

  const groupList = useMemo(() => {
    return _sortBy(converses, (x) => new Date(x.lastTime))
      .reverse()
      .map((item, index) => {
        const uuid = item.uuid;
        const name = item.name;
        const icon = item.icon || config.defaultImg.getGroup(name);

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
  }, [converses, selectedUUID, dispatch]);

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
