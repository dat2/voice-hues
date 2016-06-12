import { combineReducers } from 'redux';
import philips from './PhilipsModule';
import voice from './VoiceModule';

export default combineReducers({
  philips,
  voice
});
