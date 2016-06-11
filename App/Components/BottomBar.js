import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

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
    justifyContent: 'space-around'
  },

  // button similar styling to facebook
  bottomBarButton: {
    // space for the button
    container: {
      padding: 5,
      paddingTop: 15,
      flex: 1
    },

    // container sub container
    view: {
      flex: 1,
      alignItems: 'center'
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

  render() {
    const { name, onPress } = this.props;

    return (
      <TouchableHighlight onPress={onPress} {...style('background bottomBarButton.container')}>
        <View {...style('bottomBarButton.view')}>
          <Text {...style('bottomBarButton.text')}>{ name }</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

class BottomBar extends React.Component {

  render() {
    const { names, onPageChange } = this.props;

    return (
      <View {...style('background bottomBar')}>
        {
          names.map((name, i) =>
            <BottomBarButton name={name} key={i} onPress={() => onPageChange(name)}/>
          )
        }
      </View>
    );
  }
}

export default BottomBar;
