import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import globalStyles from './styles';
const style = globalStyles.extend({
  voiceScreen: {
    flex: 1,
  },

  voiceScreenContainer: {
    flex: 1
  },
  voiceScreenBottom: {
    width: '$appWidth',
    justifyContent: 'center',
    alignItems: 'center',

    padding: 15,

    borderTopWidth: '$hairline',
    borderTopColor: '$darkGrey'
  }
});

class ReadyPage extends React.Component {

  componentDidMount() {
    const { bridge, username, loadRooms, initializePhrases } = this.props;
    loadRooms(bridge, username);
    initializePhrases();
  }

  componentWillUnmount() {
    const { stopListening } = this.props;
    stopListening();
  }

  onPress() {
    const { startListening } = this.props;
    startListening();
  }

  render() {
    const { speaking, listeningForSpeech, text } = this.props;

    return (
      <View {...style('centered voiceScreen')}>

        {/* The main container */}
        <View {...style('voiceScreenContainer')}>
          <Text>Control your lights with your voice!</Text>
          <Text>{ listeningForSpeech.toString() }</Text>
          <Text>{ speaking.toString() }</Text>
          <Text>{ text }</Text>
        </View>

        {/* The microphone button */}
        <View  {...style('voiceScreenBottom')}>
          <TouchableOpacity onPress={this.onPress.bind(this)}>
            <Icon name='microphone' size={30} color='black' />
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

export default ReadyPage;
