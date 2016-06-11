import ControlScreen from '../Components/ControlScreen';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAuthenticateAction } from '../Modules/PhilipsModule';

const mapStateToProps = ({ philips }, { index }) => ({
  authenticated: philips.getIn(['bridge', index, 'authenticated'], false)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ authenticate: createRequestAuthenticateAction }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ControlScreen);
