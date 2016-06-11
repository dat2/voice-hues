import R from 'ramda';
import { takeEvery, delay } from 'redux-saga';
import { race, call, put } from 'redux-saga/effects';

import { discover, createApi } from '../Services/PhilipsApi';
import {
  DISCOVER_BRIDGES_REQUESTED,
  createDiscoverBridgesAction, createDiscoverBridgesFailedAction,

  AUTHENTICATE_BRIDGE_REQUESTED,
  createAuthenticateAction, createAuthenticateFailedAction
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
      const results = yield discovered
        .map(bridge => createApi(bridge.internalipaddress))
        .map(api => call(api.get, '/api/config') );

      const bridges = R.zipWith(R.merge, discovered, results.map(r => r.data))
        .map((bridge, index) => ({ ...bridge, index }));

      yield put(createDiscoverBridgesAction(bridges));
    }
  } catch(err) {
    yield put(createDiscoverBridgesFailedAction(err));
  }
}

function* authenticateBridge() {
  try {
    throw new Error('Not implemented');
  } catch(err) {
    yield put(createAuthenticateFailedAction(err));
  }
}

// the main daemon
export default function* philipsSaga() {
  yield [
    takeEvery(DISCOVER_BRIDGES_REQUESTED, discoverBridges),
    takeEvery(AUTHENTICATE_BRIDGE_REQUESTED, authenticateBridge)
  ];
}
