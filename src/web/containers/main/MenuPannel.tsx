import React, { useMemo, useCallback, Fragment } from 'react';
import config from '@shared/project.config';
import { showProfileCard, switchMenuPannel } from '@shared/redux/actions/ui';
import SlidePanel from '../../components/SlidePanel';
import ConverseList from './converse/ConverseList';
import ActorList from './actors/ActorList';
import GroupList from './group/GroupList';
import NoteList from './note/NoteList';
import ExtraOptions from './ExtraOptions';
import { TMemo } from '@shared/components/TMemo';
import {
  useTRPGSelector,
  useTRPGDispatch,
} from '@shared/hooks/useTRPGSelector';
import _get from 'lodash/get';

import './MenuPannel.scss';
import Avatar from '@web/components/Avatar';

interface Props {
  className: string;
}
export const MenuPannel: React.FC<Props> = TMemo((props) => {
  const userInfo = useTRPGSelector((state) => state.user.info);
  const name = userInfo.nickname ?? userInfo.username;
  const avatar = userInfo.avatar ?? config.defaultImg.getUser(name);
  const selectedMenuIndex = useTRPGSelector((state) => state.ui.menuIndex);
  const selectedPannel = useTRPGSelector((state) => state.ui.menuPannel);
  const network = useTRPGSelector((state) => state.ui.network);
  const dispatch = useTRPGDispatch();

  const menus = useMemo(() => {
    return [
      {
        icon: <i className="iconfont">&#xe63e;</i>,
        text: '消息',
        component: <ConverseList />,
      },
      {
        icon: <i className="iconfont">&#xe61b;</i>,
        text: '人物卡',
        component: <ActorList />,
      },
      {
        icon: <i className="iconfont">&#xe958;</i>,
        text: '团',
        component: <GroupList />,
      },
      {
        icon: <i className="iconfont">&#xe624;</i>,
        text: '记事本',
        component: <NoteList />,
      },
    ];
  }, []);

  const handleSwitchMenu = useCallback(
    (index: number) => {
      dispatch(switchMenuPannel(index, menus[index].component));
    },
    [dispatch, menus]
  );

  const menuPanelEl = useMemo(() => {
    return (
      <Fragment>
        {selectedPannel ||
          _get(menus, [selectedMenuIndex, 'component']) ||
          null}
        <SlidePanel />
      </Fragment>
    );
  }, [selectedPannel, _get(menus, [selectedMenuIndex, 'component'])]);

  return (
    <div className={props.className}>
      <div className="sidebar">
        <div className="profile">
          <div className="avatar" onClick={() => dispatch(showProfileCard())}>
            <Avatar src={avatar} name={name} size={50} />
          </div>
          <div className="network-status">
            {!network.isOnline && network.msg}
          </div>
        </div>
        <div className="menus">
          {menus.map((item, index) => {
            return (
              <a
                key={'menu-' + index}
                className={selectedMenuIndex === index ? 'active' : ''}
                onClick={() => handleSwitchMenu(index)}
              >
                {item.icon}
                <span>{item.text}</span>
              </a>
            );
          })}
        </div>
        <ExtraOptions />
      </div>
      <div className="menu-panel">{menuPanelEl}</div>
    </div>
  );
});
MenuPannel.displayName = 'MenuPannel';
