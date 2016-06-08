import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import globalStyles from './styles';

const style = globalStyles.extend({
  bottomBar: {
    // dimensions of the nav bar
    width: '$appWidth',
    height: '$navbarHeight',

    // border on top is hairline width
    borderTopColor: '$grey',
    borderTopWidth: '$hairline',

    // flex styles
    // flex 0 maintains the height
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center'
  },

  // button similar styling to facebook
  bottomBarButton: {
    // space for the button
    container: {
      padding: 5,
      paddingTop: 15
    },

    // image
    image: {

    },

    // text
    text: {
      color: '$grey'
    }
  }
});

class BottomBarButton extends React.Component {

  onPress() {
    // trigger route mutation
  }

  render() {
    const { text } = this.props;

    return (
      <TouchableOpacity onPress={this.onPress.bind(this)}>
        <View {...style('background bottomBarButton.container')}>
          <Text {...style('bottomBarButton.text')}>{ text }</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class BottomBar extends React.Component {
  render() {
    return (
      <View {...style('background bottomBar')}>
        <BottomBarButton text='Main' />
        <BottomBarButton text='Bridges' />
      </View>
    );
  }
}

export default BottomBar;
