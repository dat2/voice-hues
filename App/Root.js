import React from 'react';
import { View, StatusBar } from 'react-native';
import { Provider } from 'react-redux';

import Navigation from './Components/Navigation';
import globalStyles from './Components/styles';

import configureStore from './Store/configureStore';

const style = globalStyles.extend({
  container: {
    height: '$appHeight',

    // ensure the container is flexified
    flex: 1,
    flexDirection: 'column'
  }
});

// reactotron needs to be initialized before configureStore
import DeviceInfo from 'react-native-device-info';
import Reactotron from 'reactotron';
Reactotron.connect({
  name: DeviceInfo.getDeviceName(),
  enabled: __DEV__
});
const store = configureStore();

class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View {...style('background container')}>
          {/* since the background is gonna be white */}
          <StatusBar barStyle='default' />

          {/* TODO put navigator here */}
          <Navigation />
        </View>
      </Provider>
    );
  }
}

export default Root;
