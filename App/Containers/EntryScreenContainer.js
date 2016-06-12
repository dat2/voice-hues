import EntryScreen from '../Components/EntryScreen';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestDiscoverBridgesAction, createSelectBridgeAction } from '../Modules/PhilipsModule';

const mapStateToProps = ({ philips }) => ({
  bridges: philips.getIn(['entry', 'bridges']),
  loading: philips.getIn(['entry', 'loading']),
  error: philips.getIn(['entry', 'error'])
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  discover: createRequestDiscoverBridgesAction,
  selectBridge: createSelectBridgeAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EntryScreen);
