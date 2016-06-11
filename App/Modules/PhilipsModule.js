import Immutable from 'immutable';

function immutableError({ message, stack }) {
  return Immutable.Map({
    message,
    stack
  });
}

// action types
export const DISCOVER_BRIDGES_REQUESTED = '@@VoiceHues/DISCOVER_BRIDGES_REQUESTED';
export const DISCOVER_BRIDGES = '@@VoiceHues/DISCOVER_BRIDGES';
export const DISCOVER_BRIDGES_FAILED = '@@VoiceHues/DISCOVER_BRIDGES_FAILED';

export const AUTHENTICATE_BRIDGE_REQUESTED = '@@VoiceHues/AUTHENTICATE_BRIDGE_REQUESTED';
export const AUTHENTICATE_BRIDGE_WAITING = '@@VoiceHues/AUTHENTICATE_BRIDGE_WAITING';
export const AUTHENTICATE_BRIDGE_CANCELLED = '@@VoiceHues/AUTHENTICATE_BRIDGE_CANCELLED';
export const AUTHENTICATE_BRIDGE = '@@VoiceHues/AUTHENTICATE_BRIDGE';
export const AUTHENTICATE_BRIDGE_FAILED = '@@VoiceHues/AUTHENTICATE_BRIDGE_FAILED';

export const API_CALL_REQUESTED = '@@VoiceHues/API_CALL_REQUESTED';

// actions
export function createRequestDiscoverBridgesAction() {
  return { type: DISCOVER_BRIDGES_REQUESTED };
}

export function createDiscoverBridgesAction(bridges) {
  return { type: DISCOVER_BRIDGES, payload: { bridges }, error: null };
}

export function createDiscoverBridgesFailedAction(error) {
  return { type: DISCOVER_BRIDGES_FAILED, payload: null, error: immutableError(error) };
}

export function createRequestAuthenticateAction(bridge) {
  return { type: AUTHENTICATE_BRIDGE_REQUESTED, payload: { bridge }, error: null };
}

export function createAuthenticateBridgeWaitingAction(count) {
  return { type: AUTHENTICATE_BRIDGE_WAITING, payload: { count }, error: null };
}

export function createCancelRequestAuthenticateAction() {
  return { type: AUTHENTICATE_BRIDGE_CANCELLED };
}

export function createAuthenticateBridgeAction({ index, username }) {
  return { type: AUTHENTICATE_BRIDGE, payload: { index, username, authenticated: true }, error: null };
}

export function createAuthenticateBridgeFailedAction(error) {
  return { type: AUTHENTICATE_BRIDGE_FAILED, payload: null, error: immutableError(error) };
}

export function createApiCallRequestAction({ bridge, username, api }) {
  return { type: API_CALL_REQUESTED, payload: { bridge, username, api }, error: null };
}

// reducer
const initialState = Immutable.fromJS({
  entry: {
    bridges: [],
    loading: false,
    error: null
  },

  control: {
    error: null,
    count: 0,
    waiting: false,
    username: ''
  }
});

export default function reducer(state = initialState, action) {
  switch(action.type) {

    // discover
    case DISCOVER_BRIDGES_REQUESTED:
      return state.setIn(['entry', 'loading'], true);

    case DISCOVER_BRIDGES:
      return state.update('entry', entry => entry
        .update('bridges', bridges => bridges.merge(action.payload.bridges))
        .set('loading', false)
      );

    case DISCOVER_BRIDGES_FAILED:
      return state.update('entry', entry => entry
        .set('error', action.error)
        .set('loading', false)
      );

    // authenticate against bridge
    case AUTHENTICATE_BRIDGE_WAITING:
      return state.setIn(['control', 'waiting'], true)
        .setIn(['control', 'count'], action.payload.count);

    case AUTHENTICATE_BRIDGE:
      {
        const { index, username, ...rest } = action.payload;

        return state.updateIn(['entry', 'bridges', index], bridge => bridge.merge(Immutable.fromJS(rest)))
          .setIn(['control', 'waiting'], false)
          .setIn(['control', 'username'], username);
      }

    case AUTHENTICATE_BRIDGE_FAILED:
      return state.setIn(['control', 'error'], action.error)
          .setIn(['control', 'waiting'], false);
  }

  return state;
}
