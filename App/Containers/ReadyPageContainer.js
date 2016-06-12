import ReadyPage from '../Components/ReadyPage';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createApiCallRequestAction, LOAD_ROOMS } from '../Modules/PhilipsModule';
import { createStartListeningAction, createStopListeningAction, createInitializePhrasesAction } from '../Modules/VoiceModule';
import { API_NAMES } from '../Services/PhilipsApi';

const mapStateToProps = ({ philips, voice }) => ({
  username: philips.getIn(['control', 'username']),
  listeningForSpeech: voice.get('listeningForSpeech'),
  text: voice.getIn(['hypothesis', 'hypothesis'])
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  loadRooms: (bridge, username) => createApiCallRequestAction({ bridge, username, api: { name: API_NAMES.getGroups, args: {} }, type: LOAD_ROOMS }),
  initializePhrases: createInitializePhrasesAction,
  startListening: createStartListeningAction,
  stopListening: createStopListeningAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ReadyPage);
