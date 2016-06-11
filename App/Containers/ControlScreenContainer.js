import ControlScreen from '../Components/ControlScreen';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAuthenticateAction, createCancelRequestAuthenticateAction, createApiCallRequestAction } from '../Modules/PhilipsModule';

const mapStateToProps = ({ philips }) => ({
  waiting: philips.getIn(['control', 'waiting']),
  count: philips.getIn(['control', 'count']),
  error: philips.getIn(['control', 'error']),
  username: philips.getIn(['control', 'username'])
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  // auth stuff
  authenticate: createRequestAuthenticateAction,
  cancelAuthenticate: createCancelRequestAuthenticateAction,

  // actions that actually do things
  makeApiCall: createApiCallRequestAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ControlScreen);
