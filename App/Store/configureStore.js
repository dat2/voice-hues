import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, autoRehydrate } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';
import { AsyncStorage } from 'react-native';
import sagas from '../Sagas';
import Reactotron from 'reactotron';
import rootReducer from '../Modules/reducers';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore() {

  // create enhancers
  const enhancers = compose(
    autoRehydrate({ log: true }),
    applyMiddleware(sagaMiddleware),
    Reactotron.storeEnhancer()
  );

  // create the store
  const store = createStore(
    rootReducer,
    enhancers
  );
  persistStore(store, { storage: AsyncStorage, transforms: [immutableTransform({})] });

  // run the daemons
  sagaMiddleware.run(sagas);

  // return the store
  return store;
}
