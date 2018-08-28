import { combineReducers } from 'redux'
import { drizzleReducers } from 'drizzle'
import app from './app'
import home from './home'
import adminStoreForm from './adminStoreForm'
import storeOwnerStoreForm from './storeOwnerStoreForm'
import storeOwnerProductForm from './storeOwnerProductForm'

export default combineReducers({
  app,
  home,
  adminStoreForm,
  storeOwnerStoreForm,
  storeOwnerProductForm,
  ...drizzleReducers,
})
