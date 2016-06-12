import { takeEvery, delay } from 'redux-saga';
import { take, fork, race, call, put, cancel, cancelled, select } from 'redux-saga/effects';
import R from 'ramda';
import { REHYDRATE } from 'redux-persist/constants';

import { discover, createApi, getConfig, createUser, NAMES_TO_API_CALL, API_NAMES } from '../Services/PhilipsApi';
import {
  // discover actions
  DISCOVER_BRIDGES_REQUESTED,
  createDiscoverBridgesAction, createDiscoverBridgesFailedAction,

  // authenticate actions
  AUTHENTICATE_BRIDGE_REQUESTED,
  AUTHENTICATE_BRIDGE_CANCELLED,
  createAuthenticateBridgeWaitingAction, createAuthenticateBridgeAction, createAuthenticateBridgeFailedAction,

  // api call action
  API_CALL_REQUESTED, createApiCallRequestAction,
  TURN_ROOM_ON,
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

function* apiCall(action) {
  const { bridge: { internalipaddress }, username, api: { name, args }, type } = action.payload;

  const api = createApi(internalipaddress);

  // TODO response actions
  try {
    const results = yield call(NAMES_TO_API_CALL[name], api, username, args);
    if(type !== '') {
      yield put({ type, payload: { results: results.data }, error: null });
    }
  } catch(err) {
    console.warn(err);
  }
}

function* turnRoomOn(action) {
  const { room, value } = action.payload;

  const philips = yield select(state => state.philips);

  // get the bridge
  const bridge = philips.getIn(['entry', 'bridges', philips.getIn(['control', 'selected'])]).toJS();
  const username = philips.getIn(['control', 'username']);

  const result = philips.getIn(['control', 'rooms']).findEntry(r => r.get('name').toUpperCase() === room);
  if(result) {
    const [id,_] = result;
    yield put(createApiCallRequestAction({ bridge, username, api: { name: API_NAMES.turnRoomOn, args: { id, on: value }} }));
  }
}

// the main daemon
export default function* philipsSaga() {
  // wait until rehydrate
  yield take(REHYDRATE);

  yield [
    takeEvery(DISCOVER_BRIDGES_REQUESTED, discoverBridges),
    takeEvery(AUTHENTICATE_BRIDGE_REQUESTED, authenticateBridge),
    takeEvery(API_CALL_REQUESTED, apiCall),
    takeEvery(TURN_ROOM_ON, turnRoomOn)
  ];
}
