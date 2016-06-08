import React from 'react';
import { View, Text } from 'react-native';
import globalStyles from './styles';

const style = globalStyles.extend({
  welcome: {
    color: '#DDD',
    fontSize: 20,
    margin: 10
  },
  instructions: {
    color: '#DDD',
    marginBottom: 5
  }
});

class MainScreen extends React.Component {
  render() {
    return (
      <View {...style('centered full')}>
        <Text {...style('centeredText welcome')}>
          Welcome to React Native!
        </Text>
        <Text {...style('centeredText instructions')}>
          To get started, edit index.ios.js
        </Text>
        <Text {...style('centeredText instructions')}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

export default MainScreen;
