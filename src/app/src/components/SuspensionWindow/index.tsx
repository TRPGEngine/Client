import React, { PureComponent, Ref } from 'react';
import {
  StyleSheet,
  Animated,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  PanResponderInstance,
  Platform,
} from 'react-native';
import RootSibling from 'react-native-root-siblings';
import DragArea, { Area } from './dragArea';
import { TMemo } from '@shared/components/TMemo';
import { NavigationScreenProps } from 'react-navigation';

// Fork from https://github.com/qikong233/react-native-floatWindow/blob/master/SuspensionWindow/index.js

const { width, height } = Dimensions.get('window');
const FloatBallWH = 60;
const rightPosition = width - FloatBallWH - 10;
const leftPosition = 10;
const MinShowDragAreaDistance = 50;

interface NavigationBarProps {
  title: string;
  leftBtnClick: () => void;
  rightComponent?: React.ReactNode;
}
const NavigationBar: React.FC<NavigationBarProps> = TMemo((props) => {
  const { title, leftBtnClick, rightComponent } = props;

  return (
    <View style={NavStyles.Bar}>
      {/** Left Button**/}
      <TouchableOpacity onPress={leftBtnClick}>
        <Image
          style={NavStyles.Left}
          source={require('../../assets/img/close.png')}
        />
      </TouchableOpacity>
      <Text style={NavStyles.Title}>{title}</Text>
      <TouchableOpacity style={NavStyles.Right}>
        {rightComponent}
      </TouchableOpacity>
      <View style={NavStyles.Separate} />
    </View>
  );
});
NavigationBar.displayName = 'NavigationBar';

interface SuspensionWindowProps {
  toFloat: boolean;
  close: () => void;
}
export default class SuspensionWindow extends PureComponent<
  SuspensionWindowProps
> {
  static navigationOptions = {
    header: null,
  };

  state = {
    animating: false,
    isOpen: false,
    animateValue: new Animated.Value(0),
    toFloat: this.props.toFloat || false,
    translateValue: new Animated.ValueXY({ x: rightPosition, y: 300 }),
    showDragArea: false,
    isInArea: false,
  };

  listenerValue = { x: rightPosition, y: 300 };

  lastValueX = rightPosition;
  lastValueY = 300;

  sibling: RootSibling;
  dragAreaRef = React.createRef<DragArea>();
  gestureResponder: PanResponderInstance;
  area: Area;
  time: number;

  /** ************ Action */
  back = () => {
    // return when is animating
    if (this.state.animating) return;
    // if screen need to be float to window
    if (this.state.toFloat) {
      this.state.isOpen && this.animate(false);
      return;
    }
    this.props.close();
  };

  open = () => {
    !this.state.isOpen && this.animate(true);
  };

  floatBtnClick = () => {
    !this.state.animating && this.open();
  };

  animate = (isOpen) => {
    this.setState({ animating: true });
    Animated.parallel([
      Animated.timing(this.state.animateValue, {
        toValue: isOpen ? 1 : 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.translateValue.y, {
        toValue: isOpen ? 0 : this.lastValueY,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.translateValue.x, {
        toValue: isOpen ? 0 : this.lastValueX,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.setState({ isOpen: isOpen, animating: false });
    });
  };

  showDragArea = () => {
    !this.state.showDragArea && this.setState({ showDragArea: true });
    if (this.sibling) {
      this.dragAreaRef.current?.show();
    } else {
      this.sibling = new RootSibling(
        (<DragArea ref={this.dragAreaRef} getArea={this.getArea} />)
      );
    }
  };

  hideDragArea = () => {
    this.state.showDragArea && this.setState({ showDragArea: false });
    this.dragAreaRef.current && this.dragAreaRef.current.hide();
  };

  getArea = (area: Area) => {
    this.area = area;
  };

  dragInOrOutArea = (isIn) => {
    if (isIn) this.dragAreaRef.current && this.dragAreaRef.current.inArea();
    else this.dragAreaRef.current && this.dragAreaRef.current.outArea();
  };

  /** ************ Life Cycle */
  componentDidMount() {
    this.open();
  }

  componentWillMount() {
    this.state.translateValue.addListener(
      (value) => (this.listenerValue = value)
    );
    this.gestureResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: this.onPanResponderGrant,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderRelease: this.onPanResponderRelease,
      onPanResponderTerminate: this.onPanResponderRelease,
    });
  }

  componentWillUnmount() {
    this.sibling && this.sibling.destroy();
  }
  /** ************ Responder */
  onPanResponderGrant = (evt, gestureState) => {
    this.time = new Date().valueOf();
    this.state.translateValue.setOffset(this.listenerValue);
    this.state.translateValue.setValue({ x: 0, y: 0 });
  };

  onPanResponderMove = (evt, gestureState) => {
    Animated.event([
      null,
      {
        dx: this.state.translateValue.x,
        dy: this.state.translateValue.y,
      },
    ])(evt, gestureState);
    if (!this.state.showDragArea) {
      const { dx, dy } = gestureState;
      const distance = Math.sqrt(
        Math.pow(Math.abs(dx), 2) + Math.pow(Math.abs(dy), 2)
      );
      if (distance > MinShowDragAreaDistance) {
        this.showDragArea();
      }
    }

    this.state.showDragArea &&
      this.isInArea(
        (this.state.translateValue.y as any).__getValue(),
        (this.state.translateValue.x as any).__getValue()
      );
  };

  onPanResponderRelease = (evt, gestureState) => {
    this.state.translateValue.flattenOffset();
    this.hideDragArea();

    if (this.state.isInArea) {
      this.state.translateValue.setValue({ x: 10000, y: 10000 });
      this.dragAreaRef.current?.hide(this.props.close);
      return;
    }

    const y = (this.state.translateValue.y as any).__getValue();
    // deal with y position
    if (y < 10 || y > height - FloatBallWH - 10) {
      Animated.spring(this.state.translateValue.y, {
        toValue: y < 10 ? 10 : height - FloatBallWH - 10,
        // duration: 200,
        useNativeDriver: true,
      }).start();
    }
    // deal with x position
    Animated.spring(this.state.translateValue.x, {
      toValue: gestureState.moveX > width * 0.5 ? rightPosition : leftPosition,
      // duration: 200,
      useNativeDriver: true,
    }).start();

    // get last time translateValue
    this.lastValueX = (this.state.translateValue.x as any).__getValue();
    this.lastValueY = (this.state.translateValue.y as any).__getValue();

    const releaseTime = new Date().valueOf();
    // single tap
    if (
      releaseTime - this.time < 50 &&
      Math.abs(gestureState.dx) < 10 &&
      Math.abs(gestureState.dy) < 10
    ) {
      !this.state.isOpen && this.open();
    }
  };

  isInArea = (top, left) => {
    if (this.area) {
      const isIn = top > this.area.top && left > this.area.left;
      if (isIn === this.state.isInArea) return;
      if (isIn) {
        this.setState({ isInArea: true }, () => this.dragInOrOutArea(true));
      } else {
        this.setState({ isInArea: false }, () => this.dragInOrOutArea(false));
      }
    }
  };

  /** ************ Render Component */
  renderFloatBtn() {
    const { isOpen, toFloat, animating } = this.state;
    if (!isOpen && toFloat && !animating) {
      return (
        <View
          {...this.gestureResponder.panHandlers}
          style={[styles.FloatPosition, styles.FloatBtn]}
        >
          <Image
            source={require('../../assets/img/link.png')}
            style={styles.FloatImage}
          />
        </View>
      );
    }
    return null;
  }

  render() {
    const { translateValue } = this.state;

    const animStyle = {
      width: this.state.animateValue.interpolate({
        inputRange: [0, 1],
        outputRange: [FloatBallWH, width],
      }),
      height: this.state.animateValue.interpolate({
        inputRange: [0, 1],
        outputRange: [FloatBallWH, height],
      }),
      borderRadius: this.state.animateValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [FloatBallWH * 0.5, 20, 0],
      }),
    };

    const transformStyle = {
      transform: translateValue.getTranslateTransform(),
    };

    return (
      <Animated.View style={[styles.container, animStyle, transformStyle]}>
        <NavigationBar title="Suspend" leftBtnClick={this.back} />
        <View
          style={{
            marginTop: 64,
            flex: 1,
            backgroundColor: 'white',
          }}
        >
          {this.props.children}
        </View>
        {this.renderFloatBtn()}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 2,
  },
  FloatBtn: {
    height: FloatBallWH,
    width: FloatBallWH,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FloatPosition: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  FloatImage: {
    width: 30,
    height: 30,
  },
});

const NavStyles = StyleSheet.create({
  Bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 20,
  },
  Left: {
    marginLeft: 20,
    width: 20,
    height: 20,
  },
  Title: {
    fontSize: 17,
  },
  Right: {
    marginRight: 20,
    width: 20,
    height: 20,
  },
  Separate: {
    height: 0.5,
    backgroundColor: 'lightgray',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
