import { takeEvery, delay } from 'redux-saga';
import { take, fork, race, call, put, cancel, cancelled } from 'redux-saga/effects';
import R from 'ramda';
import { REHYDRATE } from 'redux-persist/constants';

import { discover, createApi, getConfig, createUser, turnLightOn } from '../Services/PhilipsApi';
import {
  // discover actions
  DISCOVER_BRIDGES_REQUESTED,
  createDiscoverBridgesAction, createDiscoverBridgesFailedAction,

  // authenticate actions
  AUTHENTICATE_BRIDGE_REQUESTED,
  AUTHENTICATE_BRIDGE_CANCELLED,
  createAuthenticateBridgeWaitingAction, createAuthenticateBridgeAction, createAuthenticateBridgeFailedAction,

  // api call action
  API_CALL_REQUESTED
} from '../Modules/PhilipsModule';


// discover and return them to redux
function* discoverBridges() {
  try {
    const { discovered, timeout } = yield race({
      discovered: call(discover),
      timeout: call(delay, 5000)
    });

    // if we couldn't find the bridges, then timeout error occurred
    if(timeout) {
      yield put(createDiscoverBridgesFailedAction(new Error('Timed out searching for bridges')));
    } else {
      // get more information about each bridge :)
      const results = yield discovered.map(bridge => call(getConfig, bridge.internalipaddress));

      const bridges = R.zipWith(R.merge, discovered, results)
        .map((bridge, index) => ({ ...bridge, index, authenticated: false }));

      yield put(createDiscoverBridgesAction(bridges));
    }
  } catch(err) {
    yield put(createDiscoverBridgesFailedAction(err));
  }
}

function* authenticateBridgeBg({ internalipaddress, index }) {
  const api = createApi(internalipaddress);

  try {
    // put the waiting for auth status
    let count = 30, authenticated = false;

    while(count > 0 && !authenticated) {
      yield put(createAuthenticateBridgeWaitingAction(count));

      try {
        const result = yield call(createUser, api);
        authenticated = true;
        yield put(createAuthenticateBridgeAction({ ...result, index }));
      } catch(err) {
        yield delay(1000);
        count--;
      }
    }

    if(authenticated === false) {
      throw new Error('Failed to authenticate within the time limit');
    }

  } catch(err) {
    yield put(createAuthenticateBridgeFailedAction(err));
  } finally {
    if(yield cancelled()) {
      yield put(createAuthenticateBridgeFailedAction(new Error('Cancelled authentication')));
    }
  }
}

function* authenticateBridge(action) {
  if(action.payload.bridge.authenticated) {
    return;
  }

  const authBridgeTask = yield fork(authenticateBridgeBg, action.payload.bridge);

  yield take(AUTHENTICATE_BRIDGE_CANCELLED);
  yield cancel(authBridgeTask);
}

const NAMES_TO_API_CALL = {
  TURN_LIGHT_ON: turnLightOn
};

function* apiCall(action) {
  const { bridge: { internalipaddress }, username, api: { name, args } } = action.payload;

  const api = createApi(internalipaddress);

  // TODO response actions
  try {
    yield call(NAMES_TO_API_CALL[name], api, username, args);
  } catch(err) {
    console.warn(err);
  }
}

// the main daemon
export default function* philipsSaga() {
  // wait until rehydrate
  yield take(REHYDRATE);

  yield [
    takeEvery(DISCOVER_BRIDGES_REQUESTED, discoverBridges),
    takeEvery(AUTHENTICATE_BRIDGE_REQUESTED, authenticateBridge),
    takeEvery(API_CALL_REQUESTED, apiCall)
  ];
}
