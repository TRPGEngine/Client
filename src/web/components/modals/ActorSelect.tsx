import React, { useCallback, useState } from 'react';
import config from '@shared/project.config';
import { showAlert } from '@shared/redux/actions/ui';
import ActorCreate from '@web/components/modals/ActorCreate';
import { TMemo } from '@shared/components/TMemo';
import {
  useTRPGDispatch,
  useTRPGSelector,
} from '@shared/hooks/useTRPGSelector';
import { openModal } from '../Modal';

import './ActorSelect.scss';

interface Props {
  onSelect: (selectActorUUID: string, selectActorInfo: any) => void;
}
const ActorSelect: React.FC<Props> = TMemo((props) => {
  const [selectActorUUID, setSelectActorUUID] = useState<string | null>(null);
  const selfActors = useTRPGSelector((state) => state.actor.selfActors);
  const dispatch = useTRPGDispatch();

  const handleSelect = useCallback(() => {
    if (selectActorUUID) {
      console.log('[人物卡列表]选择了' + selectActorUUID);
      const selectActorInfo = selfActors.find(
        (a) => a.uuid === selectActorUUID
      );
      props.onSelect && props.onSelect(selectActorUUID, selectActorInfo);
    } else {
      dispatch(showAlert('请选择人物卡'));
    }
  }, [props.onSelect, selfActors, selectActorUUID]);

  const handleActorCreate = useCallback(() => {
    openModal(<ActorCreate />);
  }, []);

  return (
    <div className="actor-select">
      <h3>请选择人物卡</h3>
      <div className="actor-list">
        {selfActors.length > 0 ? (
          selfActors.map((item, index) => {
            const uuid = item.uuid;
            return (
              <div
                key={`actor-item#${uuid}#${index}`}
                className={
                  'actor-item' + (selectActorUUID === uuid ? ' active' : '')
                }
                onClick={() => setSelectActorUUID(uuid)}
              >
                <div
                  className="actor-avatar"
                  style={{
                    backgroundImage: `url(${
                      item.avatar || config.defaultImg.actor
                    })`,
                  }}
                />
                <div className="actor-info">
                  <div className="actor-name">{item.name}</div>
                  <div className="actor-desc">{item.desc}</div>
                </div>
                <div className="actor-extra">
                  <i className="iconfont">&#xe620;</i>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-actor">
            尚无人物卡, 现在去
            <span onClick={handleActorCreate}>创建</span>
          </div>
        )}
      </div>
      <div className="action">
        <button onClick={handleSelect}>确定</button>
      </div>
    </div>
  );
});
ActorSelect.displayName = 'ActorSelect';

export default ActorSelect;
