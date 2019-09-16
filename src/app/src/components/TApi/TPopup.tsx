import React from 'react';
import { View, ViewStyle } from 'react-native';
import RootSiblings from 'react-native-root-siblings';

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

const TPopup = {
  _window: null,
  show: function(win) {
    if (this._window) {
      this.hide();
    }

    this._window = new RootSiblings(<TPopupContainer>{win}</TPopupContainer>);
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
