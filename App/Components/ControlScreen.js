import React from 'react';
import { TouchableHighlight, View, Image, Text } from 'react-native';
import { API_NAMES } from '../Services/PhilipsApi';
import ReadyPageContainer from '../Containers/ReadyPageContainer';

import globalStyles from './styles';
const style = globalStyles.extend({
  waitingScreen: {
    image: {
      width: 120,
      height: 120
    }
  }
});

class ControlScreen extends React.Component {

  componentDidMount() {
    const { authenticate, bridge, loadRooms, username } = this.props;
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
    makeApiCall({ bridge, username, api: { name: API_NAMES.turnRoomOn, args: { id: 0, on: false } } });
  }


  render() {
    const { waiting, bridge } = this.props;

    return waiting ? this.renderWaitScreen() : <ReadyPageContainer bridge={bridge} />;
  }
}

export default ControlScreen;
