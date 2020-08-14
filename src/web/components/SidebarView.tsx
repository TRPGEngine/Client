import React, { useState, useContext } from 'react';
import { TMemo } from '@shared/components/TMemo';
import _get from 'lodash/get';
import styled from 'styled-components';

interface SidebarViewMenuItemType {
  type: 'item';
  title: string;
  content: React.ReactNode;
  isDanger?: boolean;
}

const Root = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const Sidebar = styled.nav`
  flex: 1 0 218px;
  padding: 60px 10px 80px 0;
  background-color: ${(props) => props.theme.color.transparent90};
  display: flex;
  justify-content: flex-end;
`;

const Content = styled.div`
  flex: 1 1 800px;
  padding: 60px 40px 80px;
`;

const SidebarViewMenuGroupTitle = styled.div`
  padding: 6px 10px;
  padding-top: 0;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  text-transform: uppercase;
`;

const SidebarViewMenuItemTitle = styled.div`
  border-radius: 3px;
  padding: 6px 10px;
  margin-bottom: 3px;
  color: ${(props) => props.theme.color.interactiveNormal};
  width: 192px;
  line-height: 20px;
  cursor: pointer;

  &:hover,
  &.active {
    background-color: ${(props) => props.theme.color.transparent90};
    color: ${(props) => props.theme.color.interactiveHover};
  }

  &.active {
    color: ${(props) => props.theme.color.interactiveActive};
  }
`;

interface SidebarViewContextProps {
  content: React.ReactNode;
  setContent: (content: React.ReactNode) => void;
}
export const SidebarViewContext = React.createContext<SidebarViewContextProps | null>(
  null
);

export type SidebarViewMenuType =
  | {
      type: 'group';
      title: string;
      children: SidebarViewMenuItemType[];
    }
  | SidebarViewMenuItemType;

interface SidebarViewMenuProps {
  menu: SidebarViewMenuType;
}
const SidebarViewMenuItem: React.FC<SidebarViewMenuProps> = TMemo((props) => {
  const { menu } = props;
  const context = useContext(SidebarViewContext);

  if (!context) {
    return null;
  }

  const { content, setContent } = context;

  if (menu.type === 'group') {
    return (
      <div>
        <SidebarViewMenuGroupTitle>{menu.title}</SidebarViewMenuGroupTitle>
        <div>
          {menu.children.map((sub, i) => (
            <SidebarViewMenuItem key={i} menu={sub} />
          ))}
        </div>
      </div>
    );
  } else if (menu.type === 'item') {
    return (
      <div>
        <SidebarViewMenuItemTitle
          className={content === menu.content ? 'active' : ''}
          onClick={() => setContent(menu.content)}
        >
          {menu.title}
        </SidebarViewMenuItemTitle>
      </div>
    );
  }

  return null;
});
SidebarViewMenuItem.displayName = 'SidebarViewMenuItem';

interface SidebarViewProps {
  menu: SidebarViewMenuType[];
  defaultContentPath: string;
}
export const SidebarView: React.FC<SidebarViewProps> = TMemo((props) => {
  const { menu, defaultContentPath = '0.children.0.content' } = props;
  const [content, setContent] = useState<React.ReactNode>(
    _get(menu, defaultContentPath, null)
  );

  return (
    <SidebarViewContext.Provider value={{ content, setContent }}>
      <Root>
        <Sidebar>
          {menu.map((item, i) => (
            <SidebarViewMenuItem key={i} menu={item} />
          ))}
        </Sidebar>
        <Content>{content}</Content>
      </Root>
    </SidebarViewContext.Provider>
  );
});
SidebarView.displayName = 'SidebarView';
