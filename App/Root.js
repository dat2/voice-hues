import React from 'react';
import { Text, View, StatusBar } from 'react-native';
import { Provider } from 'react-redux';

import MainScreen from './Components/MainScreen';
import BottomBar from './Components/BottomBar';
import globalStyles from './Components/styles';

import configureStore from './Store/configureStore';

const style = globalStyles.extend({
  container: {
    paddingTop: 20,
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
          {/* since the background is gonna be black */}
          <StatusBar barStyle='light-content' />

          {/* TODO put navigator here */}
          <MainScreen />

          {/* Like facebook / the original app */}
          <BottomBar />
        </View>
      </Provider>
    );
  }
}

export default Root;
