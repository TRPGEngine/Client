import React from 'react';
import { MessageProps } from '@shared/components/message/MessageHandler';
import { AnyKindOfDictionary } from 'lodash';

class BaseCard<P extends MessageProps = MessageProps> extends React.Component<
  P
> {
  // 获取卡片视图
  getCardView() {
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
    if (this.props.info && this.props.info.data && this.props.info.data.title) {
      return <div className="card-title">{this.props.info.data.title}</div>;
    }

    return null;
  }

  render() {
    return (
      <div className="bubble">
        {this.getCardTitle()}
        {this.getCardView()}
        {this.getCardAction()}
      </div>
    );
  }
}

export default BaseCard;
