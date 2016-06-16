import React from 'react';
import { Navigator, Text, View, TouchableHighlight } from 'react-native';

import globalStyles from './styles';
const style = globalStyles.extend({
  navigator: {
    paddingTop: 65
  },
  navBar: {
    // border bottom
    borderBottomColor: '$darkGrey',
    borderBottomWidth: '$hairline',

    title: {
      color: '$text',
      fontSize: 20,
      margin: 10
    }
  }
});

import EntryScreenContainer from '../Containers/EntryScreenContainer';
import ControlScreenContainer from '../Containers/ControlScreenContainer';

const screenToComponent = {
  'entry': EntryScreenContainer,
  'control': ControlScreenContainer
};

const screenToTitle = {
  'entry': 'Connect to a Bridge',
  'control': 'Control your Bridge'
};

const NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    if(index > 0) {
      return (
        <TouchableHighlight
          underlayColor='transparent'
          onPress={() => { if (index > 0) { navigator.pop(); } }}>
          <Text {...style('navBar.title')}>Back</Text>
        </TouchableHighlight>
      );
    }
    return null;
  },

  RightButton(route, navigator, index, navState) {
    // some component or null
    return null;
  },

  Title(route, navigator, index, navState) {
    // some component or null
    return <Text {...style('navBar.title')}>{ screenToTitle[route.screen] }</Text>;
  }
};

class Navigation extends React.Component {

  navigateToScreen(navigator, screen, props = {}) {
    const route = { screen, component: screenToComponent[screen], props };
    navigator.push(route);
  }

  configureScene(route, routeStack) {
     return Navigator.SceneConfigs.HorizontalSwipeJump;
  }

  renderScene(route, navigator) {
    const Component = route.component;
    return <Component {...route.props} navigate={this.navigateToScreen.bind(this, navigator)} route={route} />;
  }

  render() {
    return (
      <Navigator
        ref={c => this.navigator = c}
        {...style('background navigator')}
        initialRoute={{ screen: 'entry', component: EntryScreenContainer, props: {} }}
        renderScene={this.renderScene.bind(this)}
        configureScene={this.configureScene.bind(this)}
        navigationBar={<Navigator.NavigationBar {...style('background navBar')} routeMapper={ NavigationBarRouteMapper } />}
        />
    );
  }
}

export default Navigation;
