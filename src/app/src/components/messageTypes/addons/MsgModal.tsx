import React, { useState, useCallback, useMemo, Fragment } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { TMemo } from '@shared/components/TMemo';
import { Portal, Modal } from '@ant-design/react-native';
import _isFunction from 'lodash/isFunction';
import styledTheme from '@shared/utils/theme';

/**
 * 用于长按按钮显示Modal
 * 与Modal.operation类似。但Modal.operation限制只能传入Text文本不能传入自定义的元素
 */

interface MsgOperationNormalItem {
  name: string;
  action: () => void;
}
interface MsgOperationCustomItem {
  component: React.ReactNode;
}
export type MsgOperationItem = MsgOperationNormalItem | MsgOperationCustomItem;

export const MsgOperationListItemContainer: React.FC<{
  onPress: () => void;
}> = TMemo((props) => {
  return (
    <TouchableHighlight underlayColor="#ddd" onPress={props.onPress}>
      <View
        style={{
          flexGrow: 1,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderColor: styledTheme.color.borderBase,
          paddingVertical: 11,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            backgroundColor: 'transparent',
            textAlign: 'left',
            paddingHorizontal: 15,
          }}
        >
          {props.children}
        </Text>
      </View>
    </TouchableHighlight>
  );
});
const MsgOperationListItem: React.FC<MsgOperationNormalItem> = TMemo(
  (props) => {
    const handleClick = useCallback(() => {
      _isFunction(props.action) && props.action();
    }, [props.action]);

    return (
      <MsgOperationListItemContainer onPress={handleClick}>
        <Text>{props.name}</Text>
      </MsgOperationListItemContainer>
    );
  }
);
MsgOperationListItem.displayName = 'MsgOperationListItem';

interface Props {
  operations: MsgOperationItem[];
  onAnimationEnd: (visible: boolean) => void;
}
const MsgModalContainer: React.FC<Props> = TMemo((props) => {
  const [visible, setVisible] = useState(true);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  const handleActions = useCallback(
    (action) => {
      _isFunction(action) && action();
      handleClose();
    },
    [handleClose]
  );

  const operations = useMemo(() => {
    return props.operations.map((op, i) => {
      if ('component' in op) {
        return <Fragment key={i}>{op.component}</Fragment>;
      } else {
        return (
          <MsgOperationListItem
            key={op.name}
            name={op.name}
            action={() => handleActions(op.action)}
          />
        );
      }
    });
  }, [props.operations, handleActions]);

  return (
    <Modal
      operation
      transparent
      maskClosable
      visible={visible}
      onClose={handleClose}
      onAnimationEnd={props.onAnimationEnd}
      style={{ paddingTop: 0 }}
      bodyStyle={{ paddingBottom: 0, paddingHorizontal: 0 }}
    >
      <View>{operations}</View>
    </Modal>
  );
});
MsgModalContainer.displayName = 'MsgModalContainer';

/**
 * 打开模态框
 */
export function openMsgModal(operations: MsgOperationItem[]): number {
  const key = Portal.add(
    <MsgModalContainer
      operations={operations}
      onAnimationEnd={(visible: boolean) => {
        if (!visible) {
          Portal.remove(key);
        }
      }}
    />
  );
  return key;
}
