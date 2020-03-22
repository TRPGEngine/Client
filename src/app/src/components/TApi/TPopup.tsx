import React from 'react';
import { View, ViewStyle } from 'react-native';
import RootSiblings, { setSiblingWrapper } from 'react-native-root-siblings';
import { getCurrentStore } from '@redux/configureStore/helper';
import { Provider } from 'react-redux';

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
  show: function(win) {
    if (this._window) {
      this.hide();
    }

    this._window = new RootSiblings((<TPopupContainer>{win}</TPopupContainer>));
    return this._window;
  },
  hide: function() {
    if (this._window && this._window.destroy) {
      this._window.destroy();
      this._window = null;
    }
  },
};

export default TPopup;
