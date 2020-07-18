import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { TButton } from '../../TComponent';
import { MessageProps } from '@shared/components/message/MessageHandler';

export interface CardBtn {
  label: string;
  onClick?: () => void;
  attrs?: {};
}

class BaseCard<P extends MessageProps = MessageProps> extends React.Component<
  P
> {
  // 获取卡片视图
  getCardView(): ReactNode {
    const info = this.props.info;

    return <Text>{info.message}</Text>;
  }

  // 返回一个形如:[{label: '按钮1', onClick: () => {}}]的数组
  getCardBtn(): CardBtn[] {
    return [];
  }

  // 获取卡片动作
  getCardAction(): ReactNode {
    const btns = this.getCardBtn();
    if (!btns || btns.length === 0) {
      return null;
    }

    return (
      <View>
        {btns.map((btn, index) => {
          const { label = '', onClick, attrs } = btn;
          return (
            <TButton
              key={`${index}#${label}`}
              type={'inline'}
              style={styles.cardActionBtn}
              textStyle={{ fontSize: 16 }}
              {...attrs}
              onPress={onClick}
              disabled={!onClick}
            >
              {label}
            </TButton>
          );
        })}
      </View>
    );
  }

  // 获取卡片标题
  getCardTitle() {
    if (this.props.info && this.props.info.data && this.props.info.data.title) {
      return (
        <View>
          <Text style={styles.titleText as any}>
            {this.props.info.data.title}
          </Text>
        </View>
      );
    }

    return null;
  }

  render() {
    return (
      <View>
        {this.getCardTitle()}
        {this.getCardView()}
        {this.getCardAction()}
      </View>
    );
  }
}

const styles = {
  titleText: [{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }],
  cardActionBtn: {
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    height: 32,
    marginBottom: -2,
    marginTop: 8,
  },
};

export default BaseCard;
