import React, { useEffect } from 'react';
import ModalPanel from '../ModalPanel';
import {
  addFavoriteDice,
  removeFavoriteDice,
  updateFavoriteDice,
  saveSettings,
} from '@shared/redux/actions/settings';
import { TMemo } from '@shared/components/TMemo';
import {
  useTRPGSelector,
  useTRPGDispatch,
} from '@shared/hooks/useTRPGSelector';

import './UserSettings.scss';

export const UserSettings: React.FC = TMemo(() => {
  const userSettings = useTRPGSelector((state) => state.settings.user);
  const dispatch = useTRPGDispatch();

  useEffect(() => {
    return () => {
      dispatch(saveSettings());
    };
  }, []);

  const handleAddFavoriteDice = () => {
    dispatch(addFavoriteDice());
  };

  const handleRemoveFavoriteDice = (index: number) => {
    dispatch(removeFavoriteDice(index));
  };

  return (
    <div>
      <p>常用骰子:</p>
      <div className="user-favorite-list">
        {userSettings.favoriteDice.map((item, index) => (
          <div className="user-favorite-item" key={'favorite-dice#' + index}>
            <input
              value={item.title}
              onChange={(e) =>
                dispatch(
                  updateFavoriteDice(index, {
                    title: e.target.value,
                    value: item.value,
                  })
                )
              }
              placeholder="标题"
            />
            <input
              value={item.value}
              onChange={(e) =>
                dispatch(
                  updateFavoriteDice(index, {
                    title: item.title,
                    value: e.target.value,
                  })
                )
              }
              placeholder="骰值"
            />
            <button
              title="移除该项"
              onClick={() => handleRemoveFavoriteDice(index)}
            >
              <i className="iconfont">&#xe657;</i>
            </button>
          </div>
        ))}
        <button onClick={handleAddFavoriteDice}>
          <i className="iconfont">&#xe604;</i>
        </button>
      </div>
    </div>
  );
});
UserSettings.displayName = 'UserSettings';

const UserSettingsModal: React.FC = TMemo(() => {
  return (
    <ModalPanel title="个人设置" className="user-settings">
      <UserSettings />
    </ModalPanel>
  );
});
UserSettingsModal.displayName = 'UserSettingsModal';

export default UserSettingsModal;
