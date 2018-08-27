import { combineReducers } from 'redux'
import { drizzleReducers } from 'drizzle'
import app from './app'
import home from './home'
import adminStoreForm from './adminStoreForm'

export default combineReducers({
  app,
  home,
  adminStoreForm,
  ...drizzleReducers,
})
