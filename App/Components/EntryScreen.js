import React from 'react';
import { ListView, View, Text, TouchableHighlight } from 'react-native';
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
    width: '$appWidth',

    padding: 10,

    borderBottomColor: '$grey',
    borderBottomWidth: '$hairline'
  },

  bridgeText: {
    color: '$text',
    fontSize: 20,

    name: {
      flex: 1
    }
  },

  listView: {
    borderBottomColor: '$grey',
    borderBottomWidth: '$hairline'
  }
});

class Bridge extends React.Component {

  onPress() {
    const { navigate, ...rest } = this.props;
    navigate('control', rest);
  }

  render() {
    const { name, internalipaddress } = this.props;

    return (
      <TouchableHighlight onPress={this.onPress.bind(this)} {...style('bridgeHighlight')}>
        <View {...style('bridge')}>
          <Text {...style('bridgeText.name')}>{ name }</Text>
          <Text {...style('bridgeText')}>{ internalipaddress }</Text>
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
    console.log(this.props, nextProps);
    if(this.props.bridges !== nextProps.bridges) {
      this.setState({ dataSource: this.state.dataSource.cloneWithRows(nextProps.bridges.toJS()) });
    }
  }

  renderRow(row) {
    const { navigate } = this.props;
    return <Bridge {...row} navigate={navigate}/>;
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
