import React from 'react';
import type { MessageProps } from '@shared/components/message/MessageHandler';
import _get from 'lodash/get';
import classNames from 'classnames';

class BaseCard<
  P extends MessageProps = MessageProps
> extends React.Component<P> {
  get cardType() {
    return _get(this.props.info, ['data', 'type']);
  }

  // 获取卡片视图
  getCardView(): React.ReactNode {
    const info = this.props.info;

    return <pre className="card-content">{info.message}</pre>;
  }

  // 返回一个形如:[{label: '按钮1', onClick:()=>{}}]的数组
  getCardBtn(): { label: string; onClick?: () => void; attrs?: any }[] {
    return [];
  }

  // 获取卡片动作
  getCardAction() {
    const btns = this.getCardBtn();
    if (!btns || btns.length === 0) {
      return null;
    }

    return (
      <div className="card-action">
        {btns.map((btn, index) => {
          const { label = '', onClick, attrs } = btn;
          return (
            <button
              key={`${index}#${label}`}
              {...attrs}
              onClick={onClick}
              disabled={!onClick}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  // 获取卡片标题
  getCardTitle() {
    const title = _get(this.props.info, 'data.title');
    if (typeof title === 'string') {
      return <div className="card-title">{title}</div>;
    }

    return null;
  }

  render() {
    return (
      <div className={classNames('bubble', `bubble-${this.cardType}`)}>
        {this.getCardTitle()}
        {this.getCardView()}
        {this.getCardAction()}
      </div>
    );
  }
}

export default BaseCard;
