import React from 'react';
import { ListView, Image, View, Text, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import globalStyles from './styles';

const style = globalStyles.extend({

  bridgeHighlight: {
    props: {
      underlayColor: '$grey'
    }
  },

  bridge: {
    flex: 1,
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    padding: 10,
    marginLeft: 15,

    borderBottomColor: '$grey',
    borderBottomWidth: '$hairline',

    // greyed out if not authenticated
    opacity: 0.5,

    authenticated: {
      opacity: 1
    }
  },

  bridgeCheck: {
    // paddingLeft: 5,
    paddingRight: 5
  },

  bridgeImage: {
    width: 40,
    height: 40,
    marginRight: 10
  },

  bridgeTextContainer: {
    flex: 1
  },

  bridgeText: {
    color: '$text',

    name: {
      fontSize: 20
    },
    description: {
      fontSize: 12,
      color: '$lightText'
    }
  },

  bridgeChevron: {
    props: {
      color: '$darkGrey'
    }
  },

  listView: {
    borderBottomColor: '$grey',
    borderBottomWidth: '$hairline',
    width: '$appWidth'
  }
});

class Bridge extends React.Component {

  onPress() {
    const { navigate, selectBridge, ...rest } = this.props;
    navigate('control', { bridge: rest });
    selectBridge(rest.index);
  }

  render() {
    const { authenticated, name, internalipaddress, modelid } = this.props;

    const image = modelid === 'BSB001' ? require('../Images/bridge_v1.png') : require('../Images/bridge_v2.png');

    return (
      <TouchableHighlight onPress={this.onPress.bind(this)} {...style('bridgeHighlight')}>
        <View {...style(`bridge${authenticated ? '.authenticated' : ''}`)}>
          <Image source={image} {...style('bridgeImage')} />
          <View {...style('bridgeTextContainer')}>
            <Text {...style('bridgeText.name')}>{ name }</Text>
            <Text {...style('bridgeText.description')}>{ internalipaddress }</Text>
          </View>
          <Icon name='chevron-right' size={15} {...style('bridgeChevron')} />
        </View>
      </TouchableHighlight>
    );
  }
}

class EntryScreen extends React.Component {

  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: dataSource.cloneWithRows(props.bridges.toJS())
    };
  }

  componentDidMount() {
    const { discover } = this.props;
    discover();
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.bridges !== nextProps.bridges) {
      this.setState({ dataSource: this.state.dataSource.cloneWithRows(nextProps.bridges.toJS()) });
    }
  }

  renderRow(row) {
    const { navigate, selectBridge } = this.props;
    return <Bridge {...row} navigate={navigate} selectBridge={selectBridge}/>;
  }

  renderBridges() {
    const { loading, error } = this.props;
    const { dataSource } = this.state;

    if(loading) {
      return <Text>Loading</Text>;
    } else {
      if(error) {
        return <Text>Error!</Text>;
      } else {
        return (
          <ListView
            {...style('listView')}
            enableEmptySections={true}
            dataSource={dataSource}
            renderRow={this.renderRow.bind(this)}
            />
        );
      }
    }
  }

  render() {
    return (
      <View {...style('centered entryScreen')}>
        { this.renderBridges() }
      </View>
    );
  }
}

export default EntryScreen;
