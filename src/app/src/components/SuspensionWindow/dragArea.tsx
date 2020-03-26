import React, { PureComponent } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const AreaWH = height * 0.6;
const AreaTop = height - 0.5 * width;
const AreaLeft = 0.55 * width;
const InAreaBigger = 15;

export interface Area {
  top: number;
  left: number;
}

interface Props {
  getArea: (pos: Area) => void;
}
export default class extends PureComponent<Props> {
  static defaultProps = {
    getArea: () => {},
  };

  animaValue = new Animated.ValueXY({ x: AreaWH * 0.5, y: AreaWH * 0.5 });
  subAnimaValue = new Animated.ValueXY({ x: 0, y: 0 });

  inArea = () => {
    Animated.parallel([
      Animated.timing(this.animaValue, {
        toValue: { x: -InAreaBigger, y: -InAreaBigger },
        duration: 20,
        easing: Easing.linear,
      }),
      Animated.timing(this.subAnimaValue, {
        toValue: { x: InAreaBigger, y: InAreaBigger },
        duration: 20,
        easing: Easing.linear,
      }),
    ]).start();
  };

  outArea = () => {
    Animated.parallel([
      Animated.timing(this.animaValue, {
        toValue: { x: 0, y: 0 },
        duration: 50,
        easing: Easing.linear,
      }),
      Animated.timing(this.subAnimaValue, {
        toValue: { x: 0, y: 0 },
        duration: 50,
        easing: Easing.linear,
      }),
    ]).start();
  };

  show = () => {
    Animated.timing(this.animaValue, {
      toValue: { x: 0, y: 0 },
      duration: 200,
      easing: Easing.linear,
    }).start();
  };

  hide = (close?) => {
    Animated.timing(this.animaValue, {
      toValue: { x: AreaWH * 0.5, y: AreaWH * 0.5 },
      duration: 200,
      easing: Easing.linear,
    }).start(() => close && close());
  };

  componentDidMount = () => {
    this.show();
    this.props.getArea && this.props.getArea({ top: AreaTop, left: AreaLeft });
  };

  render() {
    const transformAnima = {
      transform: this.animaValue.getTranslateTransform(),
    };

    const subTransformAnima = {
      transform: this.subAnimaValue.getTranslateTransform(),
    };

    return (
      <Animated.View style={[styles.container, transformAnima]}>
        <Animated.View
          style={[
            {
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: AreaWH * 0.5,
              height: AreaWH * 0.5,
            },
            subTransformAnima,
          ]}
        >
          <Image
            style={{
              width: 30,
              height: 30,
              marginTop: AreaWH * 0.15,
              marginBottom: 15,
            }}
            source={require('../../assets/img/minus-cycle-o.png')}
          />
          <Text style={{ color: 'white', fontSize: 12, marginRight: 5 }}>
            取消悬浮
          </Text>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: AreaWH,
    height: AreaWH,
    borderRadius: AreaWH * 0.5,
    left: AreaLeft,
    top: AreaTop,
    backgroundColor: '#rgba(235, 81, 81, 1)',
    overflow: 'hidden',
  },
});
