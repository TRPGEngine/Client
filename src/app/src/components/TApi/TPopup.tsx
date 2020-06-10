import React from 'react';
import { View, ViewStyle } from 'react-native';
import RootSiblings, { setSiblingWrapper } from 'react-native-root-siblings';
import { getCurrentStore } from '@redux/configureStore/helper';
import { Provider } from 'react-redux';
import { Portal } from '@ant-design/react-native';

const styles = {
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
};

class TPopupContainer extends React.Component {
  render() {
    return <View style={styles.container}>{this.props.children}</View>;
  }
}

// 设置redux wrapper
setSiblingWrapper((sibling) => (
  <Provider store={getCurrentStore()}>{sibling}</Provider>
));

const TPopup = {
  _window: null,
  _index: null,
  show: function(win: React.ReactNode) {
    if (this._index) {
      // this.hide();
      Portal.remove(this._index);
    }

    this._index = Portal.add(<TPopupContainer>{win}</TPopupContainer>);

    return this._index;

    // this._window = new RootSiblings((<TPopupContainer>{win}</TPopupContainer>));
    // return this._window;
  },
  hide: function() {
    // if (this._window && this._window.destroy) {
    //   this._window.destroy();
    //   this._window = null;
    // }
    if (this._index) {
      Portal.remove(this._index);
      this._index = null;
    }
  },
};

export default TPopup;
