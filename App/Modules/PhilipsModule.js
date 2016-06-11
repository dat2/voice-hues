import Immutable from 'immutable';

function immutableError({ message, stack }) {
  console.dir(stack);
  return Immutable.Map({
    message
  });
}

// action types
export const DISCOVER_BRIDGES_REQUESTED = '@@VoiceHues/DISCOVER_BRIDGES_REQUESTED';
export const DISCOVER_BRIDGES = '@@VoiceHues/DISCOVER_BRIDGES';
export const DISCOVER_BRIDGES_FAILED = '@@VoiceHues/DISCOVER_BRIDGES_FAILED';

export const AUTHENTICATE_BRIDGE_REQUESTED = '@@VoiceHues/AUTHENTICATE_BRIDGE_REQUESTED';
export const AUTHENTICATE_BRIDGE = '@@VoiceHues/AUTHENTICATE_BRIDGE';
export const AUTHENTICATE_BRIDGE_FAILED = '@@VoiceHues/AUTHENTICATE_BRIDGE_FAILED';

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

export function createRequestAuthenticateAction() {
  return { type: AUTHENTICATE_BRIDGE_REQUESTED };
}

export function createAuthenticateAction({ index, devicetype, username }) {
  return { type: AUTHENTICATE_BRIDGE, payload: { index, devicetype, username }, error: null };
}

export function createAuthenticateFailedAction(error) {
  return { type: AUTHENTICATE_BRIDGE_FAILED, payload: null, error: immutableError(error) };
}

// reducer
const initialState = Immutable.fromJS({
  entry: {
    bridges: [],
    loading: false,
    error: null
  },

  control: {
    error: null
  }
});

export default function reducer(state = initialState, action) {
  switch(action.type) {

    // discover
    case DISCOVER_BRIDGES_REQUESTED:
      return state.setIn(['entry', 'loading'], true);

    case DISCOVER_BRIDGES:
      return state.update('entry', entry => entry
        .set('bridges', Immutable.fromJS(action.payload.bridges))
        .set('loading', false)
      );

    case DISCOVER_BRIDGES_FAILED:
      return state.update('entry', entry => entry
        .set('error', action.error)
        .set('loading', false)
      );

    // authenticate against bridge
    case AUTHENTICATE_BRIDGE:
      {
        const { index, ...rest } = action.payload;

        return state.updateIn(['entry', 'bridges', index], bridge => bridge.merge(Immutable.fromJS(rest)));
      }

    case AUTHENTICATE_BRIDGE_FAILED:
      return state.setIn(['control', 'error'], action.error);
  }

  return state;
}
