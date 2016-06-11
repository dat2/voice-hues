import React from 'react';
import { View, Text } from 'react-native';
import globalStyles from './styles';

const style = globalStyles.extend({
  voiceScreen: {

  }
});

class ControlScreen extends React.Component {

  componentDidMount() {
    const { authenticate, bridge } = this.props;
    authenticate(bridge);
  }

  render() {
    const { authenticated } = this.props;

    return (
      <View {...style('centered voiceScreen')}>
        <Text>The voice screen!</Text>
      </View>
    );
  }
}

export default ControlScreen;
