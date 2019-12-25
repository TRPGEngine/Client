import React, { ReactNode } from 'react';
import _get from 'lodash/get';

import './Tabs.scss';

export class TabsController extends React.Component {
  state = {
    selectedIndex: 0,
  };

  render() {
    return (
      <div className="tab">
        <nav className="tab-nav">
          {React.Children.map(this.props.children, (element, index) => {
            return (
              <div
                className={
                  'tab-item' +
                  (index === this.state.selectedIndex ? ' active' : '')
                }
                onClick={() => this.setState({ selectedIndex: index })}
              >
                {_get(element, 'props.name')}
              </div>
            );
          })}
        </nav>
        <div className="tab-content">
          {React.Children.map(this.props.children, (element, index) => {
            return (
              <div
                className={index === this.state.selectedIndex ? 'active' : ''}
              >
                {element}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

interface TabProps {
  name: ReactNode;
}
export class Tab extends React.Component<TabProps> {
  render() {
    return <div className="tab-items">{this.props.children}</div>;
  }
}
