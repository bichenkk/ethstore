import React from 'react'
import ReactDOM from 'react-dom'
import { DrizzleProvider } from 'drizzle-react'
import App from './containers/App'
import store from './store'
import drizzleOptions from './drizzleOptions'

if (process.env.NODE_ENV !== 'production') {
  console.log('===== Development =====') // eslint-disable-line
} else {
  console.log('===== Production =====') // eslint-disable-line
}

ReactDOM.render(
  <DrizzleProvider options={drizzleOptions} store={store}>
    <App />
  </DrizzleProvider>,
  document.getElementById('app'),
)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/App', () => {
    const NextApp = require('./containers/App').default // eslint-disable-line
    ReactDOM.render(
      <DrizzleProvider options={drizzleOptions} store={store}>
        <NextApp />
      </DrizzleProvider >,
      document.getElementById('app'),
    )
  })
}
