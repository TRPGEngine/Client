import React from 'react';

import './ModalPanel.scss';

/**
 * 基础模态框容器
 */
interface Props {
  title?: string;
  className?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}
class ModalPanel extends React.Component<Props> {
  render() {
    return (
      <div className={'modal-panel ' + (this.props.className || '')}>
        <div className="head">{this.props.title}</div>
        <div className="body">{this.props.children}</div>
        {this.props.actions ? (
          <div className="foot">{this.props.actions}</div>
        ) : null}
      </div>
    );
  }
}

export default ModalPanel;
