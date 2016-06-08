import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import sagas from '../Sagas';
import Reactotron from 'reactotron';
// import rootReducer from './Reducers';
const rootReducer = x => x;

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState = undefined) {

  // create enhancers
  const enhancers = compose(
    applyMiddleware(sagaMiddleware),
    Reactotron.storeEnhancer()
  );

  // create the store
  const store = createStore(
    rootReducer,
    enhancers
  );

  // run the daemons
  sagaMiddleware.run(sagas);

  // return the store
  return store;
}
