import React from 'react';
import { TouchableHighlight, View, Image, Text } from 'react-native';
import globalStyles from './styles';

const style = globalStyles.extend({
  voiceScreen: {

  },
  waitingScreen: {
    image: {
      width: 120,
      height: 120
    }
  }
});

class ControlScreen extends React.Component {

  componentDidMount() {
    const { authenticate, bridge } = this.props;
    authenticate(bridge);
  }

  componentWillUnmount() {
    const { cancelAuthenticate } = this.props;
    cancelAuthenticate();
  }

  // if we are not authenticated, we must render the "try auth screen"
  renderWaitScreen() {
    const { count, bridge: { modelid } } = this.props;

    const source = modelid === 'BSB001' ? require('../Images/pushlink_bridgev1.png') : require('../Images/pushlink_bridgev2.png');

    return (
      <View {...style('centered waitingScreen')}>
        <Image
          {...style('waitingScreen.image')}
          source={source}
          />
        <Text>Waiting to authenticate: { count }</Text>
      </View>
    );
  }

  onPress() {
    const { bridge, username, makeApiCall } = this.props;
    makeApiCall({ bridge, username, api: { name: 'TURN_LIGHT_ON', args: { id: 1, on: true } } });
  }

  renderControlScreen() {
    const { bridge: { authenticated } } = this.props;
    // TODO check if authenticated :)

    return (
      <View {...style('centered voiceScreen')}>
        <Text>Control your lights with your voice!</Text>

        <TouchableHighlight onPress={this.onPress.bind(this)}>
          <Text>Test :)</Text>
        </TouchableHighlight>

      </View>
    );
  }

  render() {
    const { waiting } = this.props;

    return waiting ? this.renderWaitScreen() : this.renderControlScreen();
  }
}

export default ControlScreen;
