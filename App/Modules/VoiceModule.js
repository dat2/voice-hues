import Immutable from 'immutable';

import { NativeModules } from 'react-native';
const { VoiceController } = NativeModules;

// action types
export const INITIALIZE_PHRASES = '@@VoiceHues/INITIALIZE_PHRASES';
export const INITIALIZE_PHRASES_DONE = '@@VoiceHues/INITIALIZE_PHRASES_DONE';
export const START_LISTENING = '@@VoiceHues/START_LISTENING';
export const STOP_LISTENING = '@@VoiceHues/STOP_LISTENING';
export const HYPOTHESIS = '@@VoiceHues/HYPOTHESIS';
export const SPEECH_STARTED = '@@VoiceHues/SPEECH_STARTED';
export const SPEECH_ENDED = '@@VoiceHues/SPEECH_ENDED';

// action creators
export function createInitializePhrasesAction() {
  return { type: INITIALIZE_PHRASES };
}

export function createStartListeningAction() {
  VoiceController.startListening();
  return { type: START_LISTENING };
}

export function createStopListeningAction() {
  VoiceController.stopListening();
  return { type: STOP_LISTENING };
}

export function createHypothesisAction(hypothesis) {
  return { type: HYPOTHESIS, payload: { hypothesis }, error: null };
}

export function createSpeechStartedAction() {
  return { type: SPEECH_STARTED };
}

export function createSpeechEndedAction() {
  return { type: SPEECH_ENDED };
}

// reducer
const initialState = Immutable.fromJS({
  listeningForSpeech: false,
  speaking: false,
  hypothesis: {
  }
});

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case HYPOTHESIS:
      return state.set('hypothesis', Immutable.fromJS(action.payload.hypothesis));

    case SPEECH_STARTED:
      return state
        .set('speaking', true);

    case SPEECH_ENDED:
      return state
        .set('speaking', false)
        .set('hypothesis', Immutable.Map());

    case START_LISTENING:
      return state.set('listeningForSpeech', true);

    case STOP_LISTENING:
      return state
        .set('listeningForSpeech', false)
        .set('hypothesis', Immutable.Map());
  }

  return state;
}
