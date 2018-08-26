import { combineReducers } from 'redux'
import { drizzleReducers } from 'drizzle'
import app from './app'
import home from './home'

export default combineReducers({
  app,
  home,
  ...drizzleReducers,
})
