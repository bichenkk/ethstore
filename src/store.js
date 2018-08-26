import { createStore, applyMiddleware, compose } from 'redux'
import { generateContractsInitialState } from 'drizzle'
import createSagaMiddleware from 'redux-saga'
import thunkMiddleware from 'redux-thunk'
import reducer from './reducers'
import rootSaga from './rootSaga'
import drizzleOptions from './drizzleOptions'

const win = window
const sagaMiddleware = createSagaMiddleware()

const configureStore = () => {
  const initialState = {
    contracts: generateContractsInitialState(drizzleOptions),
  }

  const middlewares = [thunkMiddleware, sagaMiddleware]
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(require('redux-immutable-state-invariant').default()) // eslint-disable-line
    // middlewares.push(require('redux-logger').default) // eslint-disable-line
  }

  const storeEnhancers = compose(
    applyMiddleware(...middlewares),
    (win && win.devToolsExtension) ? win.devToolsExtension() : f => f,
  )

  const store = createStore(reducer, initialState, storeEnhancers)

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers').default // eslint-disable-line
      store.replaceReducer(nextReducer)
    })
  }

  sagaMiddleware.run(rootSaga)

  return store
}

export default configureStore()
