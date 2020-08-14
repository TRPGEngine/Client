import React, { useState } from 'react';
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
  padding: 60px 0 80px;
  background-color: ${(props) => props.theme.color.transparent90};
  display: flex;
  justify-content: flex-end;
`;

const Content = styled.div`
  flex: 1 1 800px;
  padding: 60px 40px 80px;
`;

export type SidebarViewMenuType =
  | {
      type: 'group';
      title: string;
      children: SidebarViewMenuItemType[];
    }
  | SidebarViewMenuItemType;

interface SidebarViewMenuProps {
  menu: SidebarViewMenuType;
  onChangeContent: (content: React.ReactNode) => void;
}
const SidebarViewMenuItem: React.FC<SidebarViewMenuProps> = TMemo((props) => {
  const { menu, onChangeContent } = props;

  if (menu.type === 'group') {
    return (
      <div>
        <div>{menu.title}</div>
        <div>
          {menu.children.map((sub, i) => (
            <SidebarViewMenuItem
              key={i}
              menu={sub}
              onChangeContent={onChangeContent}
            />
          ))}
        </div>
      </div>
    );
  } else if (menu.type === 'item') {
    return (
      <div>
        <div onClick={() => onChangeContent(menu.content)}>{menu.title}</div>
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
    <Root>
      <Sidebar>
        {menu.map((item, i) => (
          <SidebarViewMenuItem
            key={i}
            menu={item}
            onChangeContent={setContent}
          />
        ))}
      </Sidebar>
      <Content>{content}</Content>
    </Root>
  );
});
SidebarView.displayName = 'SidebarView';
