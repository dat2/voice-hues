import { takeEvery, delay } from 'redux-saga';
import { take, call, put } from 'redux-saga/effects';
import _ from 'lodash';

import { NativeAppEventEmitter, NativeModules } from 'react-native';
const { VoiceController } = NativeModules;
VoiceController.initialize();

import { LOAD_ROOMS, createTurnRoomOnAction } from '../Modules/PhilipsModule';
import {
  INITIALIZE_PHRASES, INITIALIZE_PHRASES_DONE,
  START_LISTENING,
  STOP_LISTENING,
  SPEECH_ENDED, HYPOTHESIS,

  createHypothesisAction, createSpeechStartedAction, createSpeechEndedAction, createStopListeningAction
} from '../Modules/VoiceModule';

let hypothesisListener = null,
  speechStartListener = null,
  speechEndListener = null;

export function listenForNativeEvents(store) {
  hypothesisListener = NativeAppEventEmitter.addListener(
    'hypothesis',
    (hypothesis) => {
      store.dispatch(createHypothesisAction(hypothesis));
    }
  );

  speechStartListener = NativeAppEventEmitter.addListener(
    'speechStarted',
    () => {
      store.dispatch(createSpeechStartedAction());
    }
  );

  speechEndListener = NativeAppEventEmitter.addListener(
    'speechFinished',
    () => {
      store.dispatch(createSpeechEndedAction());
      store.dispatch(createStopListeningAction());
    }
  );
}

function* setPhrases(action) {
  // get the rooms
  const { payload: { results } } = yield take(LOAD_ROOMS);
  const values = Object.keys(results).map(key => results[key]);
  const phrases = _.uniq(_.flatten([
    'ON', 'OFF',
    ...values.map(room => room.name.toUpperCase())
  ]));

  VoiceController.setPhrases(phrases);
  yield put({ type: INITIALIZE_PHRASES_DONE });
}

function* sendRequest() {
  const action = yield take(HYPOTHESIS);
  const text = action.payload.hypothesis.hypothesis;

  // TODO parse the actual hypothesis
  if(text.includes('ON')) {
    const room = text.substring(0, text.indexOf('ON')).trim();
    yield put(createTurnRoomOnAction({ room, value: true }));
  } else if(text.includes('OFF')) {
    const room = text.substring(0, text.indexOf('OFF')).trim();
    yield put(createTurnRoomOnAction({ room, value: false }));
  }
}

// the main daemon
export default function* voiceSaga() {
  yield [
    takeEvery(INITIALIZE_PHRASES, setPhrases),
    takeEvery(SPEECH_ENDED, sendRequest)
  ];

  // yep
  // hypothesisListener.remove();
}
