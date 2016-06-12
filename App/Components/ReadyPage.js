import React from 'react';
import { TouchableHighlight, View, Image, Text } from 'react-native';
import { API_NAMES } from '../Services/PhilipsApi';

import globalStyles from './styles';
const style = globalStyles.extend({
  voiceScreen: {

  }
});

class ReadyPage extends React.Component {

  componentDidMount() {
    const { bridge, username, loadRooms, initializePhrases, startListening } = this.props;
    loadRooms(bridge, username);
    initializePhrases();
    startListening();
  }

  componentWillUnmount() {
    const { stopListening } = this.props;
    stopListening();
  }

  render() {
    const { listeningForSpeech, text } = this.props;

    return (
      <View {...style('centered voiceScreen')}>
        <Text>Control your lights with your voice!</Text>

        <Text>{ listeningForSpeech ? 'Listening' : null }</Text>
        <Text>{ text }</Text>

      </View>
    );
  }
}

export default ReadyPage;
